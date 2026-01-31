# 🧠 Decision Helper (Java / Spring Boot)

Decision Helper is a small but complete decision-making web application that helps compare multiple options using weighted criteria and determine a clear winner.

The project demonstrates how a backend written in Java (Spring Boot) can be combined with a lightweight frontend and deployed as a real, usable product.

---

## 🔗 Live Demo

**Frontend (Netlify)**  
https://decision-helper-cure-for-code.netlify.app

**Backend API (Railway)**  
https://decision-helper-java-production.up.railway.app

**Health check**  
GET /api/ping

---

## ✨ Features

- Compare up to **8 options**
- Define up to **8 criteria** with importance weights (1–5)
- Score each option using a **1–10 scale**
- Automatic weighted score calculation
- Clear winner highlighting
- Detailed explanation of *why* an option won
- Example data loader for quick testing
- Clean UI with tooltips and onboarding hints

---

## 🧮 How the calculation works

For each option and criterion:

score × weight = weighted score

All weighted scores are summed.

The option with the **highest total weighted score** becomes the winner.

---

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot
- REST API
- DTO-based request/response model
- Global exception handling
- Custom CORS configuration
- Deployed on **Railway**

### Frontend
- Vanilla HTML, CSS, JavaScript
- No frameworks
- Deployed on **Netlify**

---

## 📁 Project Structure

```text
decision-helper-java/
├── frontend/
│   ├── index.html        # UI layout
│   ├── styles.css        # Styling
│   ├── app.js            # Frontend logic
│   └── config.js         # Backend API URL config
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/somov/decisionhelper/
│   │   │       ├── api/
│   │   │       │   ├── DecisionController.java
│   │   │       │   └── GlobalExceptionHandler.java
│   │   │       ├── core/
│   │   │       │   └── DecisionService.java
│   │   │       ├── config/
│   │   │       │   └── CorsConfig.java
│   │   │       ├── dto/
│   │   │       │   ├── EvaluateRequest.java
│   │   │       │   └── EvaluateResponse.java
│   │   │       └── DecisionProjectBackendApplication.java
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│       └── java/
│           └── com/somov/decisionhelper/
│               └── DecisionProjectBackendApplicationTests.java
│
├── pom.xml
└── README.md
```

The repository contains both backend and frontend:

- Spring Boot REST API in ```src/```
- Static frontend in ```frontend/```

---

## 🎯 Purpose of the Project

This project was created as a pet project to demonstrate:

- Clean REST API design in Java
- Proper separation of controller, service and DTO layers
- Practical Spring Boot configuration (CORS, environment variables)
- Frontend–backend integration
- Deployment of a real, usable application

---

## 📌 Possible Improvements

- Persistent storage (database)
- User accounts and saved decisions
- Presets for common scenarios (relocation, job offers, etc.)
- Mobile-first UI improvements
- Charts and visual comparison

---

## 👤 Author

Artur Somov

- **Full-Stack Developer**

GitHub: https://github.com/CureForCode
