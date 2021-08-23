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

	// React file
	fs.writeFileSync(
		`${basePath}/${filename}.tsx`,
		getReactFileContent(filename, styleExtension || 'scss'),
		mapError,
	);

	// Module index file
	fs.writeFileSync(
		`${basePath}/index.ts`,
		getModuleIndexContent(filename),
		mapError,
	);

	// Style module
	fs.writeFileSync(
		`${basePath}/${filename}.module.${styleExtension || 'scss'}`,
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
		// const filterFunc = (path) => path.includes('');
		// const filterFunc = () => true;

		const directories = getDirectoriesRecursive(__dirname);
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

			console.log({
				directory,
				filename,
				stylesheetExt,
			});
		} catch (err) {
			console.error({ err });
		}

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from React Create Module!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
