def handle_crm(email):
    lead = {
        "lead": email,
        "status": "new"
    }

    print("\n💼 Lead stored in CRM:")
    print(lead)

    return lead