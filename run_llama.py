import os
import re
import json
import torch
import requests
import pandas as pd
import docx
import pytesseract
from PIL import Image
from PyPDF2 import PdfReader
from threading import Thread
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForCausalLM, TextIteratorStreamer

# ─────────────────────────────────────────────
# 1. INITIALIZATION & CONFIGURATION
# ─────────────────────────────────────────────

# Load environment variables
load_dotenv()
token = os.getenv("HF_TOKEN")

# MODEL CONFIGURATION
# Using meta-llama/Llama-3.2-1B-Instruct for advanced security reasoning
MODEL_ID = "meta-llama/Llama-3.2-1B-Instruct" 
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

print(f"[*] AI SHIELD Security Intelligence System Initializing...")
print(f"[*] Model Engine: {MODEL_ID}")
print(f"[*] Hardware Acceleration: {DEVICE.upper()}")

# Auto-detect Tesseract binary path on Windows
TESSERACT_PATH = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

# ─────────────────────────────────────────────
# 2. FILE & API HANDLERS
# ─────────────────────────────────────────────

def read_text_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def read_json_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.dumps(json.load(f), indent=2)

def read_pdf_file(path):
    reader = PdfReader(path)
    return "".join([page.extract_text() for page in reader.pages])

def read_docx_file(path):
    doc = docx.Document(path)
    return "\n".join([para.text for para in doc.paragraphs])

def read_image_file(path):
    try:
        img = Image.open(path)
        text = pytesseract.image_to_string(img).strip()
        if text:
            print(f"[*] OCR Result: {len(text)} characters extracted.")
            return text
        print("[!] OCR Result: No readable text detected.")
        return "I have analyzed the image, but no readable text was detected."
    except Exception as e:
        return f"Error performing OCR: {e}"

def fetch_api_data(url):
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    try:
        return json.dumps(response.json(), indent=2)
    except:
        return response.text

def process_command(user_input):
    """
    Scans user input for /file and /api tags and injects data inline.
    """
    file_pattern = r'/file\s+("(?:[^"\\]|\\.)*"|\'[^\']*\'|\S+)'
    api_pattern = r'/api\s+("(?:[^"\\]|\\.)*"|\'[^\']*\'|\S+)'
    
    processed_text = user_input

    # Process /file tags
    for match in re.finditer(file_pattern, user_input):
        full_tag = match.group(0)
        path = match.group(1).strip('"').strip("'")
        
        if not os.path.exists(path):
            print(f"[!] Warning: File not found - {path}")
            continue
            
        ext = os.path.splitext(path)[1].lower()
        print(f"[*] Extracting data from: {path}")
        
        try:
            if ext == ".txt": content = read_text_file(path)
            elif ext == ".json": content = read_json_file(path)
            elif ext == ".pdf": content = read_pdf_file(path)
            elif ext == ".docx": content = read_docx_file(path)
            elif ext in [".jpg", ".jpeg", ".png", ".bmp", ".jfif", ".webp", ".tiff"]: 
                content = read_image_file(path)
            else: 
                content = read_text_file(path)
            
            processed_text = processed_text.replace(full_tag, f"\n[DATA_START: {path}]\n{content}\n[DATA_END]\n")
        except Exception as e:
            print(f"[!] Error reading {path}: {e}")

    # Process /api tags
    for match in re.finditer(api_pattern, user_input):
        full_tag = match.group(0)
        url = match.group(1).strip('"').strip("'")
        print(f"[*] Fetching API data: {url}")
        try:
            content = fetch_api_data(url)
            processed_text = processed_text.replace(full_tag, f"\n[DATA_START: {url}]\n{content}\n[DATA_END]\n")
        except Exception as e:
            print(f"[!] Error fetching {url}: {e}")

    return processed_text

# ─────────────────────────────────────────────
# 3. MODEL PREPARATION
# ─────────────────────────────────────────────

try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, token=token)
    
    load_kwargs = {"device_map": "auto", "token": token, "trust_remote_code": True}
    if DEVICE == "cuda":
        load_kwargs["load_in_4bit"] = True
    else:
        load_kwargs["torch_dtype"] = torch.float32

    model = AutoModelForCausalLM.from_pretrained(MODEL_ID, **load_kwargs)
    print("[+] AI SHIELD Status: SECURE & OPERATIONAL")

except Exception as e:
    print(f"[!] Initialization Failed: {e}")
    exit(1)

# ─────────────────────────────────────────────
# 4. SECURE CHAT LOOP
# ─────────────────────────────────────────────

print("\n" + "="*60)
print("AI SHIELD v1.0 - SECURITY ANALYTICS INTERFACE")
print("Commands:")
print("  - /file <path>  : Analyze local files (txt, json, pdf, docx, img)")
print("  - /api <url>    : Query external JSON APIs")
print("  - /clear        : Flush conversation memory")
print("  - exit          : Shutdown system")
print("="*60)

system_msg = (
    "You are AI SHIELD, a security-focused intelligence assistant. "
    "Analyze logs, files, and API data for threats, anomalies, and insights. "
    "Data is provided between [DATA_START] and [DATA_END] tags. "
    "Maintain a professional, alert, and precise security persona."
)
messages = [{"role": "system", "content": system_msg}]

while True:
    try:
        user_raw = input("\nShield-User> ").strip()
        if user_raw.lower() in ["exit", "quit"]:
            break
        if not user_raw:
            continue

        # Clean terminal noise from pasted text
        for p in ["PS D:\\AI_SHIELD>", "You: ", "AI SHIELD: ", "(.venv) "]:
            if user_raw.startswith(p): user_raw = user_raw[len(p):].strip()

        if user_raw.lower() == "/clear":
            messages = [messages[0]]
            print("[*] Memory flushed.")
            continue

        # Process inline data commands
        enriched_prompt = process_command(user_raw)
        messages.append({"role": "user", "content": enriched_prompt})

        # History management
        if len(messages) > 12:
            messages = [messages[0]] + messages[-11:]

        # Tokenization & Generation
        inputs = tokenizer.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt", return_dict=True).to(model.device)
        streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
        
        gen_thread = Thread(target=model.generate, kwargs=dict(
            **inputs, streamer=streamer, max_new_tokens=1024, do_sample=True, temperature=0.6, top_p=0.9,
            pad_token_id=tokenizer.eos_token_id or tokenizer.pad_token_id
        ))
        gen_thread.start()

        print("Shield-AI: ", end="", flush=True)
        full_resp = ""
        for token_text in streamer:
            print(token_text, end="", flush=True)
            full_resp += token_text
        print()
        messages.append({"role": "assistant", "content": full_resp})

    except KeyboardInterrupt:
        print("\n[*] Operation aborted by user.")
        continue
    except Exception as e:
        print(f"\n[CRITICAL ERROR] {e}")
