from domain.models import CheckIn

def evaluate_rules(checkin: CheckIn):
    questions = []

    if checkin.sleep in ["no", "mas_o_menos"] and checkin.energy <= 4:
        questions.append({
            "id": "focus_issues",
            "text": "¿Sentís dificultad para concentrarte hoy?"
        })

    if "estrés" in checkin.personal_issues or "ansiedad" in checkin.personal_issues:
        questions.append({
            "id": "urgency",
            "text": "¿Sentís urgencia constante o presión interna?"
        })

    if checkin.mood == "mal" and checkin.work_issue:
        questions.append({
            "id": "psych_safety",
            "text": "¿Te sentís seguro/a para hablar de errores o problemas?"
        })

    if checkin.energy <= 3 and checkin.mood in ["regular", "mal"]:
        questions.append({
            "id": "burnout",
            "text": "¿Te sentís emocionalmente desgastado/a?"
        })

    return questions
