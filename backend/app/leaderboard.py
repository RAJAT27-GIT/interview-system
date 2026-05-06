from typing import List, Dict

LEADERBOARD: List[Dict] = []

def add_score(user_name: str, score: int):
    LEADERBOARD.append({"user": user_name, "score": score})
    LEADERBOARD.sort(key=lambda x: x['score'], reverse=True)

def get_leaderboard(top_n: int = 10) -> List[Dict]:
    return LEADERBOARD[:top_n]
