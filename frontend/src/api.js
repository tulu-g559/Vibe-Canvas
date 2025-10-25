import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const generateImage = async (prompt) => {
  try {
    const response = await api.post(
      "/generate_image",
      { prompt },
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Image generation failed");
  }
};

export const generateLyrics = async (prompt, mood) => {
  try {
    const response = await api.post("/generate_lyrics", { prompt, mood });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Lyrics generation failed");
  }
};

export const generateLyricsAudio = async (prompt, mood, lyrics) => {
  try {
    const response = await api.post(
      "/generate_lyrics_audio_from_prompt",
      { prompt, mood, lyrics },
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Audio generation failed");
  }
};
