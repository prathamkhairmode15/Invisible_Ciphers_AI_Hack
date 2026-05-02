import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
token = os.getenv("HF_TOKEN")

# CONFIGURATION
MODEL_ID = "meta-llama/Llama-3.2-1B-Instruct"
DATASET_PATH = "security_training_data.jsonl"
OUTPUT_DIR = "./shield_model_finetuned"

print(f"[*] Starting AI SHIELD Fine-Tuning...")

# 1. Load Dataset
dataset = load_dataset("json", data_files=DATASET_PATH, split="train")

# 2. Configure 4-bit Quantization
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
)

# 3. Load Model & Tokenizer
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    quantization_config=bnb_config,
    device_map="auto",
    token=token,
    trust_remote_code=True
)
model = prepare_model_for_kbit_training(model)

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, token=token)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right"

# 4. LoRA Configuration
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"], # Common for Llama models
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)
model = get_peft_model(model, lora_config)

# 5. Training Arguments
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    logging_steps=1,
    num_train_epochs=3, # 3 epochs is usually enough for small datasets
    save_steps=10,
    fp16=True,
    push_to_hub=False,
    report_to="none"
)

# 6. Formatting Function for SFTTrainer
def formatting_prompts_func(example):
    output_texts = []
    for i in range(len(example['instruction'])):
        text = f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are AI SHIELD, a security assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{example['instruction'][i]}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n{example['output'][i]}<|eot_id|>"
        output_texts.append(text)
    return output_texts

# 7. Initialize Trainer
trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    peft_config=lora_config,
    formatting_func=formatting_prompts_func,
    max_seq_length=512,
    tokenizer=tokenizer,
    args=training_args,
)

# 8. Train
print("[*] Training in progress... This may take a while.")
trainer.train()

# 9. Save the Finetuned LoRA Adapters
trainer.model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)

print(f"[+] Training Complete! Adapters saved to {OUTPUT_DIR}")
print("[*] To use this model, update run_llama.py to load from this directory.")
