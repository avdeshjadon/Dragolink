<div align="center">
  <img src="https://raw.githubusercontent.com/Dragolink/dragolink/main/frontend/public/dragolink.svg" alt="Dragolink Logo" width="120" />
  <h1>Dragolink</h1>
  <p><strong>A Premium Open-Source URL Shortener and Advanced Link Management Platform</strong></p>
</div>

---

Dragolink is more than just a URL shortener. Built with a modern **React (Vite)** frontend and a robust **Spring Boot** backend, Dragolink is a highly scalable, production-ready platform for individuals and teams to build, track, and optimize their links effortlessly.

## ✨ Features

- 🔗 **Link Shortening & Custom Aliases:** Generate short URLs automatically or define your own custom aliases for branding.
- 🔀 **Dynamic Routing:** Redirect users to different destination URLs based on their Operating System (OS) or Device Type (Mobile/Desktop).
- 🏷️ **UTM & Campaign Management:** Easily group links into marketing campaigns and automatically append UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, etc.) for seamless external tracking.
- 📊 **Comprehensive Analytics:** Track every click with in-depth analytics, including:
  - Total Clicks & Unique Visitors
  - Browser & OS distribution
  - Device Types (Desktop vs. Mobile)
  - Referrer tracking & IP geolocation
- 📱 **QR Code Generator:** Instantly generate highly customizable QR codes for any short link.
- 🔑 **API Key Management:** Generate secure API keys to integrate Dragolink's shortening features directly into your own applications.
- 🎨 **Premium UI:** A stunning, fully responsive dashboard built with Tailwind CSS and Framer Motion, featuring dark mode and subtle micro-animations.

## 💻 Tech Stack

**Frontend:**
- React 18 (Vite)
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios
- Chart.js (react-chartjs-2)
- Lucide React & Google Material Symbols

**Backend:**
- Java 17
- Spring Boot 3.x
- Spring Security (JWT Authentication)
- Spring Data JPA
- PostgreSQL (or H2 for local dev)
- Maven

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java 17+
- Maven

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the project:
   ```bash
   mvn clean install
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will run on `http://localhost:8080`*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`*

## 🛡️ Security & Privacy
- **Abuse Protection:** Built-in mechanisms to block malicious domains and rate-limit API endpoints.
- **Privacy Controls:** Users can choose exactly what data points (IP, Browser, OS, Referrer) they want to track per link.
- **Secure Authentication:** JWT-based stateless authentication with robust password hashing.

## 📄 License
Copyright (c) 2026 Avdesh Jadon (Dragolink).
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this software, via any medium, is strictly prohibited without prior written consent.
