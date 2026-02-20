from fastapi import APIRouter, Depends, HTTPException
from store.memory import get_team_kpis, get_team_chat_kpis
from core.auth_dep import get_current_user

router = APIRouter()

@router.get("/team/{team}")
def team_dashboard(team: str, user=Depends(get_current_user)):
    if user.get("role") != "rrhh":
        raise HTTPException(status_code=403, detail="No autorizado")

    # KPIs del checkin inicial
    checkin_data = get_team_kpis(team)
    # KPIs enriquecidos generados por la IA tras la conversación
    chat_data = get_team_chat_kpis(team)

    if not checkin_data and not chat_data:
        return {"team": team, "kpis": {}, "chat_kpis": {}, "sample_size": 0}

    result = {"team": team, "sample_size": max(len(checkin_data), len(chat_data))}

    if checkin_data:
        avg = lambda k: sum(d[k] for d in checkin_data if k in d) / len(checkin_data)
        result["kpis"] = {
            "psychological_safety": avg("psychological_safety"),
            "emotional_load": avg("emotional_load"),
            "stress_anxiety": avg("stress_anxiety"),
            "burnout_risk": avg("burnout_risk"),
            "presenteeism": avg("presenteeism"),
            "focus_level": avg("focus_level"),
        }
    else:
        result["kpis"] = {}

    if chat_data:
        chat_keys = ["presentismo_improductivo", "estres_ansiedad", "seguridad_psicologica",
                     "riesgo_burnout", "carga_emocional", "foco"]
        avg_chat = lambda k: sum(d[k] for d in chat_data if k in d) / len(chat_data)
        result["chat_kpis"] = {k: avg_chat(k) for k in chat_keys if any(k in d for d in chat_data)}
    else:
        result["chat_kpis"] = {}

    return result
