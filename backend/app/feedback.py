# Feedback generator — no heavy ML models needed for rule-based feedback

from typing import List, TypedDict

class FeedbackEntry(TypedDict):
    text: str
    score_range: List[int]

FEEDBACK_BANK: List[FeedbackEntry] = [
    {"text": "🌟 Excellent answer! You covered all key points clearly and demonstrated strong understanding.", "score_range": [90, 100]},
    {"text": "👍 Good effort! You covered most concepts well, but a few important details were missing.", "score_range": [75, 89]},
    {"text": "📝 Decent attempt. You have a basic understanding but missed several key concepts. Review the topic again.", "score_range": [50, 74]},
    {"text": "⚠️ Needs significant improvement. Major gaps detected in your answer. Please study the core concepts thoroughly.", "score_range": [25, 49]},
    {"text": "❌ Poor answer. Your response didn't address the question adequately. Start with fundamentals.", "score_range": [0, 24]}
]


def generate_feedback(final_score: int) -> str:
    for fb in FEEDBACK_BANK:
        if fb['score_range'][0] <= final_score <= fb['score_range'][1]:
            return fb['text']
    return "No feedback available."