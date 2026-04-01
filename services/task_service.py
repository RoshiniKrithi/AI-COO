import json
from datetime import datetime

FILE_PATH = "data/tasks.json"

def create_task(email_text, priority):
    task = {
        "task": email_text,
        "priority": priority,
        "status": "pending",
        "created_at": str(datetime.now())
    }

    try:
        with open(FILE_PATH, "r") as file:
            tasks = json.load(file)
    except:
        tasks = []

    tasks.append(task)

    with open(FILE_PATH, "w") as file:
        json.dump(tasks, file, indent=4)

    return task