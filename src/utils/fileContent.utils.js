const fs = require('fs');
const path = require('path');

const getReactFileContent = (filename, styleExtension) => `import React from 'react';

import styles from './${filename[0].toLowerCase()}${filename.slice(1)}.module${styleExtension}';

interface Props {
}

const ${filename} = (props: Props) => {
  const {} = props;

  return (
  );
};

export default ${filename};\n`;

const getModuleIndexContent = (filename) => `export { default } from './${filename}';\n`;

const createFiles = (filename, basePath, styleExtension) => {
  const errors = [];

  const mapError = (err) => errors.push(err);

  // Create directory
  fs.mkdirSync(path.resolve(basePath, filename));

  // React file
  fs.writeFileSync(
    path.resolve(basePath, filename, `${filename}.tsx`),
    getReactFileContent(filename, styleExtension || 'scss'),
    mapError
  );

  // Module index file
  fs.writeFileSync(
    path.resolve(basePath, filename, 'index.tsx'),
    getModuleIndexContent(filename),
    mapError
  );

  // Style module
  fs.writeFileSync(
    path.resolve(
      basePath,
      filename,
      `${filename[0].toLowerCase()}${filename.slice(1)}.module${styleExtension || '.scss'}`
    ),
    '',
    mapError
  );

  console.log({ errors });
};

module.exports = {
  createFiles,
};
