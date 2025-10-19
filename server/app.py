import os
from flask import Flask, request, send_file, jsonify
from huggingface_hub import InferenceClient
from PIL import Image
from dotenv import load_dotenv
from elevenlabs import ElevenLabs
import google.generativeai as genai

from io import BytesIO

# Load environment variables
load_dotenv()

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Vibe Canvas server!"})


# Hugging Face client for Stable Diffusion
hf_client = InferenceClient(api_key=os.environ["HF_TOKEN"])
# Initialize Gemini
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
# Initialize ElevenLabs client
tts_client = ElevenLabs(api_key=os.environ["XI_API_KEY"])





# ---------------------------
# ROUTE 1: IMAGE GENERATION
# ---------------------------
@app.route('/generate_image', methods=['POST'])
def generate_image():
    try:
        data = request.get_json(force=True)
        prompt = data.get("prompt", "A colorful abstract painting")

        # Generate image
        image: Image.Image = hf_client.text_to_image(
            prompt,
            model="stabilityai/stable-diffusion-xl-base-1.0"
        )

        # Convert to bytes
        img_bytes = BytesIO()
        image.save(img_bytes, format='PNG')
        img_bytes.seek(0)

        return send_file(img_bytes, mimetype='image/png')

    except Exception as e:
        # Return error details in JSON (so Postman sees why)
        return {"error": str(e)}, 500





def create_lyrics_text(user_prompt: str = None, mood: str = "neutral", lyrics_override: str = None) -> str:
    """
    Returns lyrics text.
    - If lyrics_override is provided and non-empty, return it.
    - Otherwise, require user_prompt and call Gemini to generate lyrics.
    """
    if lyrics_override and lyrics_override.strip():
        return lyrics_override.strip()

    if not user_prompt or not user_prompt.strip():
        raise ValueError("Prompt is required when no 'lyrics' is provided.")

    model = genai.GenerativeModel("gemini-2.0-flash")
    gemini_prompt = f"""
    Write a creative and original song lyrics or short poem that reflects the mood '{mood}'. Prompt: {user_prompt}
    Don't mention (Verse) or (Chorus) or (Bridge) or (Instrumental) or (Intro) or (Outro) or any other tags.
    """
    response = model.generate_content(gemini_prompt)
    return response.text.strip()


# --- ROUTE: generate lyrics (uses helper) ---
@app.route("/generate_lyrics", methods=["POST"])
def generate_lyrics():
    try:
        data = request.get_json(force=True)
        user_prompt = data.get("prompt", "")
        mood = data.get("mood", "neutral")
        # allow caller to directly pass lyrics (optional)
        lyrics_override = data.get("lyrics")

        lyrics_text = create_lyrics_text(user_prompt=user_prompt, mood=mood, lyrics_override=lyrics_override)
        return jsonify({"lyrics": lyrics_text})

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500





# ---------------------------
# ROUTE 3: LYRICS / POETRY TTS
# ---------------------------
@app.route('/generate_lyrics_audio_from_prompt', methods=['POST'])
def generate_lyrics_audio_from_prompt():
    try:
        data = request.get_json(force=True)
        # Accept either full lyrics directly, or prompt+mood to generate lyrics
        lyrics = data.get("lyrics")            # preferred: full lyrics text from /generate_lyrics
        user_prompt = data.get("prompt", "")   # fallback if lyrics not provided
        mood = data.get("mood", "neutral")

        # create_lyrics_text will use `lyrics` if provided, otherwise generate from prompt+mood
        lyrics_text = create_lyrics_text(user_prompt=user_prompt, mood=mood, lyrics_override=lyrics)

        # Convert lyrics to audio via ElevenLabs TTS
        audio_generator = tts_client.text_to_speech.convert(
            text=lyrics_text,
            voice_id="JBFqnCBsd6RMkjVDRZzb",  # Indian English voice
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128"
        )

        # Convert generator to bytes
        audio_bytes = b"".join(list(audio_generator))
        buf = BytesIO(audio_bytes)
        buf.seek(0)

        # Return audio file
        return send_file(
            buf,
            mimetype="audio/mpeg",
            as_attachment=False,
            download_name="lyrics_audio.mp3"
        )

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)