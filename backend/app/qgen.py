from transformers import pipeline
import random


# Use Hugging Face transformers for paraphrasing
# For MVP: small model to reduce latency
paraphrase_pipeline = pipeline("text2text-generation", model="t5-small")




def generate_question_variation(question_text: str, num_variations: int = 1):
    variations = []
    for _ in range(num_variations):
        prompt = f"paraphrase: {question_text}"
        output = paraphrase_pipeline(prompt, max_length=100, do_sample=True, top_p=0.95)
        variations.append(output[0]['generated_text'])
    return variations


# Example: generate multiple variations from a single question
# generate_question_variation("Explain supervised vs unsupervised learning", 2)