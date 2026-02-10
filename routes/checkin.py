from fastapi import APIRouter, Depends
from domain.models import CheckIn
from domain.rules import evaluate_rules
from domain.kpis import calculate_kpis
from store.memory import save_checkin
from core.auth_dep import get_current_user

router = APIRouter()

@router.post("/")
def submit_checkin(checkin: CheckIn, user=Depends(get_current_user)):
    questions = evaluate_rules(checkin)
    kpis = calculate_kpis(checkin)

    team = user.get("team", "UNKNOWN")

    save_checkin(
        team=team,
        checkin=checkin.model_dump(),
        kpis=kpis.model_dump()
    )

    return {
        "activated_questions": questions,
        "feedback": "Gracias por compartir cómo estás hoy.",
        "team": team
    }
