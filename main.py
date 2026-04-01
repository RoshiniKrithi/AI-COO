from agents.email_agent import analyze_email
from agents.decision_agent import decide_action
from agents.task_agent import handle_task
from agents.crm_agent import handle_crm

def main():
    print("🤖 AI COO Agent - Multi-Agent System\n")

    while True:
        email = input("Enter email (or type 'exit' to quit): ")

        if email.lower() == "exit":
            print("\n👋 Exiting AI COO Agent.")
            break

        try:
            # Step 1: Email Agent
            analysis = analyze_email(email)

            print("\n--- Email Analysis ---\n")
            print(analysis)

            # Step 2: Decision Agent
            decision = decide_action(analysis)

            # Step 3: Route to Agents
            if decision == "task":
                task = handle_task(email, analysis.get("priority"))
                print("\n✅ Task Created:")
                print(task)

            elif decision == "crm":
                handle_crm(email)

            else:
                print("\n✉️ Simple reply is sufficient.")

        except Exception as e:
            print("\n❌ Error occurred:")
            print(e)


if __name__ == "__main__":
    main()