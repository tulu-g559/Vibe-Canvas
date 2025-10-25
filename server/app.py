import os
from flask import Flask, request, send_file, jsonify
from huggingface_hub import InferenceClient
from PIL import Image
from dotenv import load_dotenv
from elevenlabs import ElevenLabs
from flask_cors import CORS
import google.generativeai as genai
from io import BytesIO
import base64

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Vibe Canvas server!"})

# ---------------------------
# Hugging Face, Gemini, ElevenLabs clients
# ---------------------------
hf_client = InferenceClient(api_key=os.environ["HF_TOKEN"])
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
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
        return {"error": str(e)}, 500

# ---------------------------
# Helper: create lyrics text
# ---------------------------
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

# ---------------------------
# ROUTE 2: GENERATE LYRICS + AUDIO
# ---------------------------
@app.route("/generate_lyrics", methods=["POST"])
def generate_lyrics_with_audio():
    try:
        data = request.get_json(force=True)
        user_prompt = data.get("prompt", "")
        mood = data.get("mood", "neutral")
        lyrics_override = data.get("lyrics")  # optional

        # Generate lyrics
        lyrics_text = create_lyrics_text(
            user_prompt=user_prompt,
            mood=mood,
            lyrics_override=lyrics_override
        )

        # Convert lyrics to audio (ElevenLabs)
        audio_generator = tts_client.text_to_speech.convert(
            text=lyrics_text,
            voice_id="JBFqnCBsd6RMkjVDRZzb",  # Indian English voice
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128"
        )

        # Convert audio generator to bytes
        audio_bytes = b"".join(list(audio_generator))

        # Encode audio as base64 to send in JSON
        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")

        # Return lyrics + audio
        return jsonify({
            "lyrics": lyrics_text,
            "audio_base64": audio_base64
        })

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------
# ROUTE 3: LYRICS AUDIO ONLY (UNCHANGED)
# ---------------------------
@app.route('/generate_lyrics_audio_from_prompt', methods=['POST'])
def generate_lyrics_audio_from_prompt():
    try:
        data = request.get_json(force=True)
        lyrics = data.get("lyrics")           
        user_prompt = data.get("prompt", "")  
        mood = data.get("mood", "neutral")


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

# ---------------------------
# RUN SERVER
# ---------------------------
if __name__ == "__main__":
    app.run(debug=True)
