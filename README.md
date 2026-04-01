# 🤖 AI COO Agent – Autonomous Business Workflow System

## 🚀 Overview

AI COO Agent is a **full-stack AI-powered automation system** that analyzes business emails and automatically triggers workflows such as **task creation, CRM updates, and meeting scheduling**.

It is built using a **multi-agent architecture** where specialized AI agents collaborate to process unstructured communication and convert it into actionable decisions.

---

## 🎯 Key Features

* 🧠 **AI Email Understanding** – Classifies emails into sales, complaint, or general
* ⚙️ **Automated Decision Making** – Determines actions based on intent
* 📋 **Task Automation** – Creates tasks with priority levels
* 💼 **CRM Integration** – Stores potential leads automatically
* 📅 **Meeting Scheduling Suggestions**
* 🔄 **Real-Time UX Features** – Loading states, notifications, KPI tracking
* 🌐 **REST API Backend** using FastAPI
* 🎨 **Modern React Dashboard** with Tailwind CSS

---

## 🧠 Architecture

```
User Input (Frontend - React)
            ↓
FastAPI Backend (API Layer)
            ↓
Multi-Agent System
   ├── Email Agent (Analysis)
   ├── Decision Agent (Routing)
   ├── Task Agent (Task Creation)
   └── CRM Agent (Lead Management)
            ↓
Data Storage (JSON)
```

---

## 🛠️ Tech Stack

### 🔹 Backend

* Python
* FastAPI
* Groq API (LLM)

### 🔹 Frontend

* React
* Tailwind CSS

### 🔹 Architecture

* Multi-Agent System Design
* REST API Integration

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/ai-coo-agent.git
cd ai-coo-agent
```

---

### 2️⃣ Backend Setup

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:

```env
GROQ_API_KEY=your_api_key_here
```

Run backend:

```bash
uvicorn api:app --reload
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 📊 API Endpoint

### POST `/process-email`

#### Request:

```json
{
  "email": "I want to schedule a demo for your product"
}
```

#### Response:

```json
{
  "analysis": {
    "category": "sales",
    "priority": "medium",
    "suggested_action": "schedule_meeting"
  },
  "action": "crm",
  "lead": {
    "lead": "I want to schedule a demo",
    "status": "new"
  }
}
```

---

## 🧪 Example Use Cases

### 📩 Sales Email

→ Stored as lead in CRM
→ Suggests meeting

### ⚠️ Complaint Email

→ Creates high-priority task

### 📄 General Email

→ Suggests simple reply

---

## 💼 Real-World Applications

* Customer Support Automation
* Sales Lead Management
* Business Workflow Automation
* Email Processing Systems

---

## 🔐 Security

* `.env` file excluded using `.gitignore`
* API keys are not exposed

---

## 🚀 Future Enhancements

* 📡 Real-time email integration (Gmail API)
* 📊 Advanced analytics dashboard
* 🔄 WebSocket-based real-time updates
* 🧠 Memory-based AI improvements

---

## 👩‍💻 Author

**Roshini Krithi**

---

## ⭐ Final Note

This project demonstrates:

* Full-stack development
* AI integration
* System design thinking
* Real-world automation

👉 Built to simulate how AI can act as a **Chief Operating Officer (COO)** for business operations.
