require("dotenv").config();
const vscode = require("vscode");
const { recordAndTranscribe } = require("./speech");
const { getCodeFromPrompt } = require("./copilot");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "codeVoiceAssistant.generateCode",
    async function () {
      vscode.window.showInformationMessage(
        "Please speak your coding request..."
      );

      try {
        const prompt = await recordAndTranscribe();
        vscode.window.showInformationMessage(`Recognized prompt: ${prompt}`);

        const code = await getCodeFromPrompt(prompt);

        const editor = vscode.window.activeTextEditor;
        if (editor) {
          editor.edit((editBuilder) => {
            editBuilder.insert(editor.selection.active, code);
          });
        } else {
          vscode.window.showErrorMessage("No active editor found.");
        }
      } catch (err) {
        vscode.window.showErrorMessage(`Error: ${err.message}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
