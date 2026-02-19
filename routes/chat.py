from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from openai import OpenAI
import os

from core.auth_dep import get_current_user
from store.memory import get_user_history

router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
Sos un asistente de bienestar laboral empático y profesional dentro de una app de RRHH.
Tu rol es hacer un seguimiento breve y conversacional después de que el colaborador completó su check-in diario.

REGLAS ESTRICTAS:
- Nunca diagnosticás ni etiquetás condiciones clínicas (no decís "tenés ansiedad", "estás en burnout", etc.)
- Usás índices de riesgo, no diagnósticos
- Sos cálido, directo y breve. Máximo 2-3 oraciones por mensaje.
- Hacés UNA sola pregunta por vez
- Cuando ya tenés suficiente información (máximo 4-5 intercambios), cerrás con un mensaje de cierre amable y emitís los KPIs actualizados en formato JSON al final oculto

PATRONES QUE DETECTÁS Y PREGUNTAS QUE ACTIVÁS:

1. Bajo descanso + baja energía → preguntá sobre:
   - Dificultad para concentrarse
   - Sensación de lentitud o errores recientes
   → KPI: presentismo_improductivo

2. Estrés / ansiedad → preguntá sobre:
   - Preocupación constante o difícil de apagar
   - Dificultad para priorizar tareas
   - Sensación de urgencia permanente
   → KPI: estres_ansiedad

3. Malestar laboral (work_issue = true) → preguntá sobre:
   - Si se siente seguro/a para hablar de errores
   - Si percibe apoyo del equipo o liderazgo
   → KPI: seguridad_psicologica

4. Cansancio + desmotivación (energía ≤ 3 + humor mal/regular) → preguntá sobre:
   - Desgaste emocional
   - Sensación de ineficacia o falta de sentido
   → KPI: riesgo_burnout

Al finalizar la conversación, incluí exactamente este bloque al final de tu último mensaje (invisible para el usuario, lo procesa el sistema):
##KPIS##{"presentismo_improductivo": 0.0, "estres_ansiedad": 0.0, "seguridad_psicologica": 0.0, "riesgo_burnout": 0.0, "carga_emocional": 0.0, "foco": 0.0}##ENDKPIS##
Con valores entre 0.0 y 1.0 según lo detectado en la conversación. 1.0 = riesgo máximo.
"""

class Message(BaseModel):
    role: str  # "user" o "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    checkin_context: dict  # el checkin actual del usuario

class ChatResponse(BaseModel):
    reply: str
    kpis: Optional[dict] = None
    finished: bool = False


def build_context_message(checkin: dict, history: list) -> str:
    mood_map = {"muy_bien": "muy bien", "bien": "bien", "regular": "regular", "mal": "mal"}
    sleep_map = {"si": "sí", "mas_o_menos": "más o menos", "no": "no"}

    ctx = f"""CHECK-IN DE HOY:
- Estado de ánimo: {mood_map.get(checkin.get('mood', ''), checkin.get('mood', ''))}
- Descansó bien: {sleep_map.get(checkin.get('sleep', ''), checkin.get('sleep', ''))}
- Situaciones personales: {', '.join(checkin.get('personal_issues', [])) or 'ninguna'}
- Algo laboral lo/la impacta: {'sí' if checkin.get('work_issue') else 'no'}
- Nivel de energía: {checkin.get('energy', 5)}/10
"""
    if history:
        ctx += f"\nHISTORIAL RECIENTE: el colaborador tiene {len(history)} check-ins previos. "
        last = history[-1]
        ctx += f"En el último check-in su energía fue {last.get('energy', '?')}/10 y su estado '{mood_map.get(last.get('mood',''), last.get('mood',''))}'. "

    return ctx


def extract_kpis(text: str) -> tuple[str, Optional[dict]]:
    """Extrae el bloque de KPIs del texto de respuesta si existe."""
    import json
    if "##KPIS##" in text and "##ENDKPIS##" in text:
        start = text.index("##KPIS##") + len("##KPIS##")
        end = text.index("##ENDKPIS##")
        kpis_str = text[start:end].strip()
        clean_text = text[:text.index("##KPIS##")].strip()
        try:
            kpis = json.loads(kpis_str)
            return clean_text, kpis
        except Exception:
            return text, None
    return text, None


@router.post("/", response_model=ChatResponse)
def chat(req: ChatRequest, user=Depends(get_current_user)):
    email = user.get("email", "")
    history = get_user_history(email)

    context_msg = build_context_message(req.checkin_context, history)

    openai_messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content": context_msg},
    ]

    for m in req.messages:
        openai_messages.append({"role": m.role, "content": m.content})

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=openai_messages,
            max_tokens=300,
            temperature=0.7,
        )
        reply_raw = response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error OpenAI: {str(e)}")

    clean_reply, kpis = extract_kpis(reply_raw)
    finished = kpis is not None

    return ChatResponse(reply=clean_reply, kpis=kpis, finished=finished)
