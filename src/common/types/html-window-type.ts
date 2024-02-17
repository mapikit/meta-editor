import { ConfigurationType } from "meta-system";
import { MetaEditorInfoType } from "./meta-editor-info";
import { UserConfigType } from "./user-config";

export type ModifiedWindowType = Window & typeof globalThis & {
  fileApi : {
    saveUserInfo : (userConfig : UserConfigType) => Promise<void>;
    saveMetaEditorInfo : (versionDirPath : string, metaEditorInfo : MetaEditorInfoType) => Promise<void>;
    saveVersion : (projectName : string, config : ConfigurationType, metaEditorInfo : MetaEditorInfoType)
    => Promise<void>;
  }
}
