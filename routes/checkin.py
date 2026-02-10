from fastapi import APIRouter
from domain.models import CheckIn
from domain.rules import evaluate_rules
from domain.kpis import calculate_kpis
from store.memory import save_checkin

router = APIRouter()

@router.post("/")
def submit_checkin(checkin: CheckIn):
    questions = evaluate_rules(checkin)
    kpis = calculate_kpis(checkin)

    save_checkin(
        team="Operaciones",  # luego sale del token
        checkin=checkin.dict(),
        kpis=kpis.dict()
    )

    return {
        "activated_questions": questions,
        "feedback": "Gracias por compartir cómo estás hoy.",
    }
