const vscode = require('vscode');

const createReactModuleHandler = require('./createReactModule');
/**
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {
  let disposable = vscode.commands.registerCommand(
    'react-create-module.createReactModule',
    createReactModuleHandler
  );

  context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
