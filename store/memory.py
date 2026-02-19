from collections import defaultdict

# Almacenamiento por equipo (para dashboard RRHH)
checkins_by_team = defaultdict(list)
kpis_by_team = defaultdict(list)

# Almacenamiento por usuario (para historial de IA)
checkins_by_user = defaultdict(list)


def save_checkin(team: str, email: str, checkin: dict, kpis: dict):
    checkins_by_team[team].append(checkin)
    kpis_by_team[team].append(kpis)
    # Guardar historial por usuario (últimos 30 check-ins)
    checkins_by_user[email].append(checkin)
    if len(checkins_by_user[email]) > 30:
        checkins_by_user[email] = checkins_by_user[email][-30:]


def get_team_kpis(team: str):
    return kpis_by_team.get(team, [])


def get_user_history(email: str):
    return checkins_by_user.get(email, [])
