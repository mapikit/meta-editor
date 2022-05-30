class LocalStorageService {
  public fetchKey (keyName : string) : unknown {
    const result = localStorage.getItem(keyName);

    return JSON.parse(result);
  }

  public save (keyName : string, data : unknown) : unknown {
    const result = localStorage.setItem(keyName, JSON.stringify(data));

    return result;
  }

  public isInStorage (keyName : string) : boolean {
    const data = localStorageService.fetchKey(keyName);
    return data !== undefined && data !== null;
  }
}

export const localStorageService = new LocalStorageService();
