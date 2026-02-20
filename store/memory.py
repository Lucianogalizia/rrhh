from collections import defaultdict

# Almacenamiento por equipo (para dashboard RRHH)
checkins_by_team = defaultdict(list)
kpis_by_team = defaultdict(list)

# KPIs generados por la IA al final del chat (más ricos que los del checkin inicial)
chat_kpis_by_team = defaultdict(list)

# Almacenamiento por usuario (para historial de IA)
checkins_by_user = defaultdict(list)


def save_checkin(team: str, email: str, checkin: dict, kpis: dict):
    checkins_by_team[team].append(checkin)
    kpis_by_team[team].append(kpis)
    # Guardar historial por usuario (últimos 30 check-ins)
    checkins_by_user[email].append(checkin)
    if len(checkins_by_user[email]) > 30:
        checkins_by_user[email] = checkins_by_user[email][-30:]


def save_chat_kpis(team: str, email: str, kpis: dict):
    """Guarda los KPIs enriquecidos que genera la IA al finalizar la conversación."""
    chat_kpis_by_team[team].append({"email": email, **kpis})
    if len(chat_kpis_by_team[team]) > 500:
        chat_kpis_by_team[team] = chat_kpis_by_team[team][-500:]


def get_team_kpis(team: str):
    return kpis_by_team.get(team, [])


def get_team_chat_kpis(team: str):
    return chat_kpis_by_team.get(team, [])


def get_user_history(email: str):
    return checkins_by_user.get(email, [])
