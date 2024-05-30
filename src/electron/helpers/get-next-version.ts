export function getNextVersion (versions : string[]) : string {
  const highestVersion = versions.sort((versionA, versionB) => versionB.localeCompare(versionA))[0];
  const versionSections = highestVersion.split(".");
  const lastSectionNumber = Number(versionSections[2].match(/\d+/)[0]);
  versionSections[2] = versionSections[2].replace(
    lastSectionNumber.toString(),
    (lastSectionNumber+1).toString(),
  );
  return versionSections.join(".");
}
