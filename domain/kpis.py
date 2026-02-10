from domain.models import CheckIn, KPIResult

def calculate_kpis(checkin: CheckIn) -> KPIResult:
    stress = 0.7 if "estrés" in checkin.personal_issues else 0.3
    anxiety = 0.7 if "ansiedad" in checkin.personal_issues else 0.3

    burnout = 1.0 if checkin.energy <= 3 and checkin.mood == "mal" else 0.4
    presenteeism = 1.0 if checkin.sleep != "si" and checkin.energy <= 4 else 0.2

    focus = max(0.0, min(1.0, checkin.energy / 10))
    safety = 0.4 if checkin.work_issue else 0.8
    emotional_load = (stress + anxiety) / 2

    return KPIResult(
        psychological_safety=safety,
        emotional_load=emotional_load,
        stress_anxiety=(stress + anxiety) / 2,
        burnout_risk=burnout,
        presenteeism=presenteeism,
        focus_level=focus
    )
