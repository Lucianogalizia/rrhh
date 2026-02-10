from fastapi import APIRouter
from store.memory import get_team_kpis

router = APIRouter()

@router.get("/team/{team}")
def team_dashboard(team: str):
    data = get_team_kpis(team)

    if not data:
        return {"team": team, "kpis": {}}

    avg = lambda k: sum(d[k] for d in data) / len(data)

    return {
        "team": team,
        "kpis": {
            "psychological_safety": avg("psychological_safety"),
            "emotional_load": avg("emotional_load"),
            "stress_anxiety": avg("stress_anxiety"),
            "burnout_risk": avg("burnout_risk"),
            "presenteeism": avg("presenteeism"),
            "focus_level": avg("focus_level"),
        }
    }
