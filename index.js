require("dotenv").config();
const { recordAndTranscribe } = require("./speech");
const { getCodeFromPrompt } = require("./copilot");
const readline = require("readline");
const vscode = require("vscode");

async function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  console.log("Please speak your coding request..." + process.env.OPENAI_API_KEY + "sss");

  try {
    const prompt = await recordAndTranscribe();
    console.log("\nRecognized prompt:", prompt);

    const code = await getCodeFromPrompt(prompt);
    console.log("\nGenerated code:\n");
    console.log(code);

    const answer = await askConfirmation(
      "Generated code detected. Insert into VS Code? (y/n): "
    );
    if (answer === "y") {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.edit((editBuilder) => {
          editBuilder.insert(editor.selection.active, code);
        });
        console.log("Code inserted into VS Code.");
      } else {
        console.error("No active editor found.");
      }
    } else {
      console.log("Insertion cancelled.");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
