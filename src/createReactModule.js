const vscode = require('vscode');

const { createFiles } = require('./utils/fileContent.utils');
const { getFilteredDirectories } = require('./utils/directories.utils');

const styleExtensions = [
  { label: 'CSS', detail: '.css' },
  { label: 'SCSS', detail: '.scss' },
  { label: 'SASS', detail: '.sass' },
  { label: 'LESS', detail: '.less' },
  { label: 'STYLUS', detail: '.styl' },
];

const createReactModuleHandler = async (args) => {
  try {
    let directory;
    if (args && args.path) {
      directory = args.path;
    } else {
      if (vscode.workspace.workspaceFolders === undefined) {
        vscode.window.showErrorMessage(
          'You must open the project folder/workspace to be able to use this extension'
        );

        return;
      }

      const filteredDirectories = getFilteredDirectories(
        vscode.workspace.workspaceFolders[0].uri.path
      );

      const directoryChoiceResult = await vscode.window.showQuickPick(filteredDirectories, {
        matchOnDetail: true,
        placeHolder: 'Choose where the directory will be created...',
      });

      directory = directoryChoiceResult.fullPath;
    }

    const filename = await vscode.window.showInputBox({
      placeHolder: 'Type in the component name...',
    });

    const stylesheetExt = await vscode.window.showQuickPick(styleExtensions, {
      matchOnDetail: true,
      placeHolder: 'StyleSheet extension...',
    });

    createFiles(filename, directory, stylesheetExt.detail);

    vscode.window.showInformationMessage('Module successfully created!');
  } catch (err) {
    vscode.window.showErrorMessage('An error occured while created the module, please try again.');
  }
};

module.exports = createReactModuleHandler;
