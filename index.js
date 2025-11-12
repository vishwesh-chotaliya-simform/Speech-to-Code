require("dotenv").config();
const { recordAndTranscribe } = require("./speech");
const { getCodeFromPrompt } = require("./copilot");

async function main() {
  console.log("Please speak your coding request...");










  
  try {
    const prompt = await recordAndTranscribe();
    console.log("\nRecognized prompt:", prompt);

    const code = await getCodeFromPrompt(prompt);
    console.log("\nGenerated code:\n");
    console.log(code);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
