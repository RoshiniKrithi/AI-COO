from services.task_service import create_task

def handle_task(email, priority):
    return create_task(email, priority)