#  Feedback System

A scalable, full-stack feedback platform built for teams to exchange constructive feedback, manage requests.
I used ChatGPT to resolve errors and some get design idea 

---

##  Features

-  **Role-Based System:** Managers and employees have distinct dashboards and permissions.
-  **Feedback Workflow:**
  - Managers can submit feedback.
  - Employees can acknowledge or request feedback.
-  **Real-Time Notifications:** Automatic alerts for feedback actions and status changes.
-  **Feedback Timeline:** Historical record of all feedback with timestamps.
-  **Dashboard Insights:** Sentiment distribution and feedback stats for managers.

---

##  Tech Stack

**Backend:**
- FastAPI – Modern, high-performance Python web framework
- SQLAlchemy – ORM with PostgreSQL dialect
- PostgreSQL – Relational database
- Docker – Containerization for seamless dev environments

**Frontend:**
- Next.js – React framework for SSR & client features
- Tailwind CSS – Utility-first styling
- TypeScript – Typed JavaScript for safety & clarity

---

##  Installation & Setup

### 1. Clone the repo and install dependencies

```bash
git clone https://github.com/shwetkamal-gaud/feedback-system.git
cd feedback-system
cd backend
pip install -r requirements.txt
```

```bash
cd frontend
npm install
```

### 2 .env setup
```bash
SECRET_KEY
ALGORITHM
ENV
DATABASE_URL
```

### 3 Run the backend and Frontend
```bash
docker-compose up -d
docker-compose up --build
```

```bash
npm run dev
```
