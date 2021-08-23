const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const styleExtensions = [
	{ label: 'CSS', detail: '.css' },
	{ label: 'SCSS', detail: '.scss' },
	{ label: 'SASS', detail: '.sass' },
	{ label: 'LESS', detail: '.less' },
	{ label: 'STYLUS', detail: '.styl' }
]

const getReactFileContent = (filename, styleExtension) => `import React from 'react';

import styles from './${filename}.module${styleExtension}';

interface Props {
}

const ${filename} = (props: Props) => {
  const {} = props;

  return (
  );
};

export default ${filename};\n`;

const getModuleIndexContent = (filename) => `export { default } from './${filename}';\n`

const createFiles = (filename, basePath, styleExtension) => {
	const errors = [];

	const mapError = (err) => errors.push(err);

	console.log({ path: `${basePath}/${filename}` });

	// Create directory
	fs.mkdirSync(
		path.resolve(basePath, filename),
	)

	// React file
	fs.writeFileSync(
		path.resolve(basePath, filename, `${filename}.tsx`),
		getReactFileContent(filename, styleExtension || 'scss'),
		mapError,
	);

	// Module index file
	fs.writeFileSync(
		path.resolve(basePath, filename, 'index.tsx'),
		getModuleIndexContent(filename),
		mapError,
	);

	// Style module
	fs.writeFileSync(
		path.resolve(basePath, filename, `${filename}.module${styleExtension || '.scss'}`),
		'',
		mapError,
	);

	console.log({ errors });
}

const flatten = (lists) => {
	return lists.reduce((a, b) => a.concat(b), []);
}

const getDirectories = (srcpath) => {
	return fs.readdirSync(srcpath)
		.map(file => path.join(srcpath, file))
		.filter(path => fs.statSync(path).isDirectory())
}

const getDirectoriesRecursive = (srcpath) => {
	return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}

/**
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {
	let disposable = vscode.commands.registerCommand('react-create-module.createReactModule', async () => {
		if (vscode.workspace.workspaceFolders === undefined) {
			vscode.window.showErrorMessage('You must open the project folder/workspace to be able to use this extension');

			return;
		}

		const currentDirectoryPath = vscode.workspace.workspaceFolders[0].uri.path;

		const directories = getDirectoriesRecursive(currentDirectoryPath);
		const filteredDirectories = directories
			.filter((d) => !d.includes('node_modules'))
			.map((d) => ({
				label: d.split('/').pop(),
				detail: d,
			}));

		try {
			const directory = await vscode.window.showQuickPick(
				filteredDirectories,
				{
					matchOnDetail: true,
					placeHolder: 'Choose where the directory will be created...',
				},
			);

			const filename = await vscode.window.showInputBox({
				placeHolder: 'Type in the component name...'
			});

			const stylesheetExt = await vscode.window.showQuickPick(
				styleExtensions,
				{
					matchOnDetail: true,
					placeHolder: 'StyleSheet extension...',
				},
			);

			createFiles(
				filename,
				directory.detail,
				stylesheetExt.detail,
			);

			vscode.window.showInformationMessage('Module successfully created!');
		} catch (err) {
			console.error({ err });
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
