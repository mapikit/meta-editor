import pako from "pako";

type UnpackedHeader = {
  name : string,
  mode : string,
  uid : string,
  gid : string,
  size : number,
  mtime : string,
  checksum : string,
  type : string,
  linkname : string,
  ustar : string,
  version : string,
  uname : string,
  gname : string,
  devmajor : string,
  devminor : string,
  prefix : string,
  padding : string,
}

type UnpackedFile = {
  header : UnpackedHeader;
  data : Uint8Array;
}

export class Unpacker {
  static unpackTgzFile (gzFile : ArrayBuffer) : Array<UnpackedFile> {
    const tarFile = Unpacker.ungzip(gzFile);
    const tarEntries = Unpacker.unpackTarFile(tarFile);
    return tarEntries;
  }

  static ungzip (gzFile : ArrayBuffer) : ArrayBuffer {
    const gzFileView = new Uint8Array(gzFile);
    const tarFile = pako.inflate(gzFileView);
    return tarFile.buffer;
  }

  // eslint-disable-next-line max-lines-per-function
  static unpackTarFile (tarFile : ArrayBuffer) : Array<UnpackedFile> {
    const tarFileView = new DataView(tarFile);
    const tarEntries : Array<UnpackedFile>= [];
    let offset = 0;

    while (offset < tarFile.byteLength) {
    // Read the header of the current tar entry
      const header = {
        name: Unpacker.readString(tarFileView, offset, 100),
        mode: Unpacker.readString(tarFileView, offset + 100, 8),
        uid: Unpacker.readString(tarFileView, offset + 108, 8),
        gid: Unpacker.readString(tarFileView, offset + 116, 8),
        size: parseInt(Unpacker.readString(tarFileView, offset + 124, 12), 8),
        mtime: Unpacker.readString(tarFileView, offset + 136, 12),
        checksum: Unpacker.readString(tarFileView, offset + 148, 8),
        type: Unpacker.readString(tarFileView, offset + 156, 1),
        linkname: Unpacker.readString(tarFileView, offset + 157, 100),
        ustar: Unpacker.readString(tarFileView, offset + 257, 6),
        version: Unpacker.readString(tarFileView, offset + 263, 2),
        uname: Unpacker.readString(tarFileView, offset + 265, 32),
        gname: Unpacker.readString(tarFileView, offset + 297, 32),
        devmajor: Unpacker.readString(tarFileView, offset + 329, 8),
        devminor: Unpacker.readString(tarFileView, offset + 337, 8),
        prefix: Unpacker.readString(tarFileView, offset + 345, 155),
        padding: Unpacker.readString(tarFileView, offset + 500, 12),
      };

      // Calculate the size of the current tar entry and move the offset to the next entry
      const entrySize = Math.ceil(header.size / 512) * 512;
      const entryStart = offset + 512;
      const entryEnd = entryStart + entrySize;
      const entryData = new Uint8Array(tarFile.slice(entryStart, entryEnd));

      tarEntries.push({ header, data: entryData });
      offset = entryEnd;
    }

    return tarEntries;
  }

  static readString (dataView : DataView, offset : number, length : number) : string {
    let str = "";
    for (let i = 0; i < length; i++) {
      const charCode = dataView.getUint8(offset + i);
      if (charCode === 0) {
        break;
      }
      str += String.fromCharCode(charCode);
    }
    return str;
  }

  static getStringData (data : Uint8Array, encoding = "utf8") : string {
    const decoder = new TextDecoder(encoding);
    const decoded = decoder.decode(data.filter((item => item !== 0))); // Filters out null characters
    return decoded;
  }

  static getJsonData (data : Uint8Array, encoding = "utf8") : object {
    const string = Unpacker.getStringData(data, encoding);
    return JSON.parse(string);
  }
}

