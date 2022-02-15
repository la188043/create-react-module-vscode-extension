const fs = require('fs');
const path = require('path');

const flatten = (lists) => {
  return lists.reduce((a, b) => a.concat(b), []);
};

const getDirectories = (srcpath) => {
  return fs
    .readdirSync(srcpath)
    .map((file) => path.join(srcpath, file))
    .filter((path) => fs.statSync(path).isDirectory());
};

const getDirectoriesRecursive = (srcpath) => {
  return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
};

const getFilteredDirectories = (basePath) => {
  const directories = getDirectoriesRecursive(basePath);

  return directories
    .filter((d) => !d.includes('node_modules'))
    .map((d) => {
      const currentDirectoryName = basePath.split('/').pop();
      const directoryPathChunk = d.split('/');
      const currentPathIndex = directoryPathChunk.findIndex((dpc) => dpc === currentDirectoryName);

      const detail = directoryPathChunk.slice(currentPathIndex || 0).join('/');

      return {
        label: d.split('/').pop(),
        detail,
        fullPath: d,
      };
    });
};

module.exports = {
  getFilteredDirectories, 
};
