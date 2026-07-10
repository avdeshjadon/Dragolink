# LinkPulse – URL Shortener & Analytics Platform

LinkPulse is a powerful, full-stack URL shortener and analytics platform built with Spring Boot and React.

## Features

- **Link Shortening:** Create short URLs with random or custom aliases.
- **Analytics Dashboard:** Track clicks over time, by browser, and by device.
- **QR Codes:** Generate QR codes for any short link.
- **Abuse Protection:** Block specific domains and rate limit endpoints.
- **Authentication:** Secure login and registration using JWT.

## Tech Stack

- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT)
- **Database:** MySQL
- **Caching & Rate Limiting:** Redis
- **Event Streaming:** Apache Kafka (for async analytics)
- **Frontend:** React, Vite, Tailwind CSS v4, Recharts, React Router
- **DevOps:** Docker, Docker Compose

## Architecture Overview

```text
[Frontend (React/Nginx)] ---> [Backend API (Spring Boot)]
                                    |        |       |
                                    v        v       v
                              [ MySQL ]  [ Redis ] [ Kafka ] ---> [ Analytics Consumer (Spring Boot) ] ---> [ MySQL ]
```

## How to Run Locally

### Prerequisites
- Docker and Docker Compose
- Maven (optional, if running backend locally)
- Node.js 18+ (optional, if running frontend locally)

### Using Docker Compose (Recommended)

1. Clone the repository and navigate to the root directory.
2. Build and start all services using Docker Compose:

   ```bash
   docker-compose up -d --build
   ```

3. Wait a few seconds for MySQL and Kafka to initialize.
4. Access the frontend application at: `http://localhost:5173`
5. The backend API runs at: `http://localhost:8080`

### Accessing Endpoints

- **Frontend Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:8080/api/...`
- **Short Link Redirect:** `http://localhost:8080/{shortCode}`

## API Endpoints Summary

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and get JWT
- `GET /api/auth/me` - Get current user info

### Links
- `POST /api/links` - Create a short link
- `GET /api/links` - Get all links for the current user
- `GET /api/links/{id}` - Get link details
- `PUT /api/links/{id}` - Update a link
- `DELETE /api/links/{id}` - Delete a link
- `PATCH /api/links/{id}/toggle` - Toggle link active status
- `GET /api/links/{id}/qr` - Generate QR code for link

### Analytics
- `GET /api/analytics/dashboard` - Get aggregated stats for dashboard
- `GET /api/analytics/links/{linkId}` - Get detailed click history for a link

### Admin
- `POST /api/admin/blocked-domains` - Add a domain to the blocklist
- `GET /api/admin/blocked-domains` - Get all blocked domains
- `DELETE /api/admin/blocked-domains/{id}` - Remove a blocked domain

## Environment Variables

The `docker-compose.yml` configures all environment variables internally. If you want to customize them, look in `backend/src/main/resources/application.yml` and `docker-compose.yml`.

## Future Improvements

- Add geo-location tracking for clicks using an open-source GeoIP database.
- Implement user tiers and advanced rate limiting logic.
- Add OAuth2 login (Google, GitHub).
- Split the monolithic backend into smaller microservices (Auth, Core, Analytics).
