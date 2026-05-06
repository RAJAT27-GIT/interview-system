from rapidfuzz import fuzz
from typing import Dict, List, Union

def evaluate_answer(user_answer: str, model_answer_data: Union[Dict, None]) -> Dict:
    # ✅ Ensure model_answer_data is always a dict
    if not isinstance(model_answer_data, dict) or model_answer_data is None:
        model_answer_data = {}

    model_text = model_answer_data.get('model_answer', '')
    keywords = model_answer_data.get('keywords', [])

    similarity = fuzz.token_set_ratio(user_answer.lower(), model_text.lower())

    if keywords:
        matched_keywords = sum(1 for kw in keywords if kw.lower() in user_answer.lower())
        keyword_score = int((matched_keywords / len(keywords)) * 100)
    else:
        keyword_score = 0

    score = int(0.7 * similarity + 0.3 * keyword_score)

    return {
        'similarity': similarity,
        'keyword_score': keyword_score,
        'final_score': score
    }
