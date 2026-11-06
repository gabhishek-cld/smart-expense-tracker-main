# 💰 Smart Expense Tracker - Full-Stack Personal Finance Web Application

A production-grade, resume-ready **Smart Expense Tracker** built with **Java 17**, **Spring Boot 3**, **Spring Security (JWT)**, **Spring Data JPA**, **MySQL / H2 Database**, **React 18**, **Vite**, **TailwindCSS**, and **Recharts**.

---

## 🌟 Features Overview

### 🔐 1. Authentication & Security
- **User Registration & Login:** Password encryption using BCrypt (`BCryptPasswordEncoder`).
- **Stateless JWT Security:** Generates signed Bearer JWT tokens (`HS256`) for protected API access.
- **Strict Data Isolation:** Every expense, budget, and report query is strictly scoped to the authenticated user's ID.

### 📊 2. Interactive Financial Dashboard
- **Summary Metrics:** Total expenses, current month spending, set budget, remaining budget, and highest spending category.
- **Budget Utilization Gauge:** Visual progress bar with threshold alerts (`NORMAL`, `WARNING >= 80%`, `EXCEEDED > 100%`).
- **Interactive Visualizations:** Recharts Pie/Doughnut category breakdown and 6-month spending trend line charts.

### 📝 3. Complete Expense Management (CRUD)
- **Add / Edit / Delete Expenses:** Fields include Title, Amount, Category, Expense Date, Description, and Payment Method.
- **Search & Filtering:** Live search by title, category filtering (Food, Transport, Rent, Bills, etc.), payment method filtering, and custom date range selector.
- **Sorting & Server-Side Pagination:** Sort by amount or date in ascending/descending order.

### 🎯 4. Monthly Budget Tracking
- Set target monthly budgets per month/year.
- Live progress calculation with remaining budget and utilization percentage.

### 📥 5. Report Export System
- **CSV Export:** Download expense records as a formatted `.csv` dataset.
- **PDF Report Generation:** Professional monthly financial statements with styled tables and metric cards generated via OpenPDF.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Backend** | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA, Hibernate, Maven |
| **Security** | JSON Web Tokens (JJWT 0.11.5), BCrypt Password Encoder |
| **Database** | MySQL 9.7 / H2 Embedded Database (Mode=MySQL) |
| **Export Engines** | OpenPDF (PDF generation), Apache Commons CSV |
| **Frontend** | React 18, Vite, JavaScript (ES6+), React Router DOM v6, Axios |
| **Styling** | TailwindCSS v4, Glassmorphism Aesthetics, Dark/Light Mode |
| **Charts & Icons** | Recharts, Lucide React Icons |

---

## 📁 Project Folder Structure

```
smart-expense-tracker/
├── backend/
│   ├── .mvn/                             # Maven Wrapper
│   ├── mvnw & mvnw.cmd                   # Cross-platform Maven executable
│   ├── pom.xml                           # Maven dependencies & plugins
│   └── src/
│       ├── main/
│       │   ├── java/com/expensetracker/
│       │   │   ├── config/               # DataInitializer (Default categories seed)
│       │   │   ├── controller/           # Auth, Expense, Budget, Report, Export REST Controllers
│       │   │   ├── dto/                  # Request & Response DTOs
│       │   │   ├── entity/               # User, Expense, Budget, Category JPA Entities
│       │   │   ├── exception/            # GlobalExceptionHandler & Custom Exceptions
│       │   │   ├── repository/           # Spring Data JPA Repositories
│       │   │   ├── security/             # SecurityConfig, JwtUtils, JwtFilter, UserDetailsService
│       │   │   └── service/              # Business Logic Services
│       │   └── resources/
│       │       └── application.properties# DB & JWT Security Configuration
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── api/                          # Axios Client with JWT Interceptors
│       ├── components/                   # Navbar, Sidebar, Animated Modal
│       ├── context/                      # AuthContext & Theme Provider
│       ├── pages/                        # Landing, Login, Register, Dashboard, Expenses, Budgets, Reports, Profile, Settings
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Java Development Kit (JDK 17)** installed
- **Node.js (v18+)** and **npm** installed

---

### Step 1: Clone / Navigate to Project Directory
```bash
cd C:\Users\ADMIN\.gemini\antigravity-ide\scratch\smart-expense-tracker
```

---

### Step 2: Run Spring Boot Backend
Navigate to the `backend` folder and run the Maven wrapper:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

* The backend REST API server will start at: `http://localhost:8080`
* H2 Database Console available at: `http://localhost:8080/h2-console`

> **Note for MySQL Setup:** To switch to your local MySQL instance, configure `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` in `src/main/resources/application.properties`.

---

### Step 3: Run React Frontend
Open a second terminal window, navigate to the `frontend` folder, and start Vite:

```bash
cd frontend
npm install
npm run dev
```

* Access the application in your browser at: `http://localhost:5173`

---

## 🔌 REST API Documentation

### 🔑 Authentication APIs
| Method | Endpoint | Description | Public / Protected |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & issue Bearer JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Protected |

### 💵 Expense APIs
| Method | Endpoint | Description | Public / Protected |
|---|---|---|---|
| `POST` | `/api/expenses` | Record a new expense | Protected |
| `GET` | `/api/expenses` | Get expenses (Supports search, category, date range, pagination, sorting) | Protected |
| `GET` | `/api/expenses/{id}` | Get expense by ID | Protected |
| `PUT` | `/api/expenses/{id}` | Update expense by ID | Protected |
| `DELETE` | `/api/expenses/{id}` | Delete expense record | Protected |

### 🎯 Budget APIs
| Method | Endpoint | Description | Public / Protected |
|---|---|---|---|
| `POST` | `/api/budgets` | Set or update monthly budget | Protected |
| `GET` | `/api/budgets` | Get all saved monthly budget targets | Protected |
| `GET` | `/api/budgets/status` | Get live budget status, remaining amount, utilization % & alerts | Protected |
| `DELETE` | `/api/budgets/{id}` | Delete budget target | Protected |

### 📊 Reports & Export APIs
| Method | Endpoint | Description | Public / Protected |
|---|---|---|---|
| `GET` | `/api/reports/monthly` | Get detailed monthly spending breakdown | Protected |
| `GET` | `/api/reports/category-summary` | Get category spending totals & percentages | Protected |
| `GET` | `/api/reports/spending-trends` | Get 6-month spending trend data | Protected |
| `GET` | `/api/reports/export/csv` | Export expense dataset as CSV | Protected |
| `GET` | `/api/reports/export/pdf` | Export formatted monthly PDF report | Protected |

---

## 🧪 Sample Test Credentials

To quickly test the application, use these demo credentials on the login screen or register your own account:

* **Email:** `demo@expensetracker.com`
* **Password:** `Password123`

---

## 📜 License
This project is open-source under the MIT License. Built for resume presentation, placement technical interviews, and portfolio showcase.
