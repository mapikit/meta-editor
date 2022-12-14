export const renameObjKey = <T extends object>(oldObj : T, oldKey : string, newKey : string) : T => {
  const keys = Object.keys(oldObj);
  const newObj = keys.reduce((acc, val)=>{
    if(val === oldKey) {
      acc[newKey] = oldObj[oldKey];
    }
    else {
      acc[val] = oldObj[val];
    }
    return acc;
  }, {});

  return newObj as T;
};
