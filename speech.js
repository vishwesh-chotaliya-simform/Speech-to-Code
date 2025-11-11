const fs = require("fs");
const { spawn } = require("child_process");
const axios = require("axios");
const path = require("path");

/**
 * Records audio from the microphone and saves it as a WAV file.
 * Stops after 5 seconds or when speech ends (using arecord's silence detection).
 * Requires 'arecord' (Linux) to be installed.
 * @param {string} outputPath - Path to save the recorded audio.
 * @param {number} [duration=5] - Maximum duration of the recording in seconds.
 * @returns {Promise<string>} - Resolves when recording is finished.
 */
function recordAudio(outputPath, duration = 5) {
  return new Promise((resolve, reject) => {
    // arecord with silence detection: stops after 1s of silence or max 5s
    const arecord = spawn("arecord", [
      "-f",
      "cd",
      "-t",
      "wav",
      "-d",
      duration.toString(),
      outputPath,
    ]);

    arecord.stderr.on("data", (data) => {
      console.error(`arecord error: ${data}`);
    });

    arecord.on("close", (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new Error(`Audio recording failed (exit code ${code})`));
      }
    });
  });
}

/**
 * Sends audio file to Whisper API for transcription.
 * @param {string} audioPath - Path to audio file.
 * @returns {Promise<string>} - Transcribed text.
 */
async function transcribeAudio(audioPath) {
  const apiKey = process.env.WHISPER_API_KEY; // Set your API key in env
  const apiUrl = "https://api.openai.com/v1/audio/transcriptions";

  const audio = fs.createReadStream(audioPath);

  const FormData = require("form-data");
  const formData = new FormData();
  formData.append("file", audio, path.basename(audioPath));
  formData.append("model", "whisper-1");

  const headers = {
    ...formData.getHeaders(),
    Authorization: `Bearer ${apiKey}`,
  };

  const response = await axios.post(apiUrl, formData, { headers });
  return response.data.text;
}

/**
 * Records voice and transcribes it to text using Whisper API.
 * @returns {Promise<string>} - Recognized text.
 */
async function recordAndTranscribe() {
  const audioPath = path.join(__dirname, "input.wav");
  await recordAudio(audioPath); // Record up to 5 seconds or until silence
  const text = await transcribeAudio(audioPath);
  // fs.unlinkSync(audioPath); // Clean up
  return text;
}

module.exports = { recordAndTranscribe };
