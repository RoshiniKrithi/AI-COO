from utils.groq_client import client
import json

def analyze_email(email_text):
    prompt = f"""
You are an AI business assistant.

Classify the email STRICTLY based on intent:

Categories:
- sales → interested in product, demo, pricing, buying
- complaint → issues, not working, unhappy customer
- general → greetings, thank you, basic queries

Priority:
- high → urgent issues, complaints
- medium → sales, important requests
- low → general messages

Actions:
- reply → simple response
- create_task → requires internal follow-up
- schedule_meeting → demo, call, meeting request

Return ONLY valid JSON in this exact format:
{{
  "category": "",
  "priority": "",
  "suggested_action": ""
}}

Do NOT add any extra text.

Email:
{email_text}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    output = response.choices[0].message.content

    # Optional: clean + validate JSON (important for next phases)
    try:
        return json.loads(output)
    except:
        return {
            "error": "Invalid JSON response",
            "raw_output": output
        }