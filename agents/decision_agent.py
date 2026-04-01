def decide_action(analysis):
    action = analysis.get("suggested_action")

    if action == "create_task":
        return "task"

    elif action == "schedule_meeting":
        return "crm"

    else:
        return "reply"