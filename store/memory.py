from collections import defaultdict

checkins_by_team = defaultdict(list)
kpis_by_team = defaultdict(list)

def save_checkin(team: str, checkin: dict, kpis: dict):
    checkins_by_team[team].append(checkin)
    kpis_by_team[team].append(kpis)


def get_team_kpis(team: str):
    return kpis_by_team.get(team, [])
