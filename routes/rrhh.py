from fastapi import APIRouter, Depends, HTTPException
from store.memory import get_team_kpis
from core.auth_dep import get_current_user

router = APIRouter()

@router.get("/team/{team}")
def team_dashboard(team: str, user=Depends(get_current_user)):
    if user.get("role") != "rrhh":
        raise HTTPException(status_code=403, detail="No autorizado")

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
