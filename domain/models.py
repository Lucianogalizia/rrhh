from pydantic import BaseModel
from typing import List, Optional

class User(BaseModel):
    name: str
    lastname: str
    email: str
    team: str
    role: str = "user"


class CheckIn(BaseModel):
    mood: str                     # muy_bien | bien | regular | mal
    sleep: str                    # si | mas_o_menos | no
    personal_issues: List[str]    # estrés, ansiedad, etc
    work_issue: bool
    work_issue_note: Optional[str] = None
    energy: int                   # 0–10


class KPIResult(BaseModel):
    psychological_safety: float
    emotional_load: float
    stress_anxiety: float
    burnout_risk: float
    presenteeism: float
    focus_level: float
