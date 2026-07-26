# Dragolink Setup Guide

Welcome to the Dragolink URL Shortener & Analytics Platform setup guide. This document will walk you through the process of setting up and running the project locally.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Docker** and **Docker Compose** (for running the full stack easily)
- **Java 17** and **Maven** (if you want to run the backend manually)
- **Node.js 18+** and **npm** (if you want to run the frontend manually)

## Step 1: Environment Variables

1. In the root directory of the project, you will find an `.env.example` file.
2. Copy `.env.example` and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open the newly created `.env` file and configure the variables. The default values are already set for local development, but you can change the passwords and JWT secret for enhanced security.

## Step 2: Running with Docker Compose (Recommended)

The easiest way to run Dragolink is using Docker Compose, which will automatically build and start the backend, frontend, Zookeeper, and Kafka. (Note: Database and Redis are hosted remotely on TiDB and Upstash).

1. Open a terminal in the root directory of the project.
2. Run the following command:
   ```bash
   docker-compose up -d --build
   ```
3. Docker will pull the necessary images, build the backend (using Maven inside Docker) and frontend (using Nginx), and start all containers. 
   *(Note: The first build might take a few minutes as it downloads dependencies).*

4. **Verify the services are running:**
   ```bash
   docker-compose ps
   ```

## Step 3: Accessing the Application

Once all containers are up and healthy, you can access the platform:

- **Frontend Application (React UI):** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8080/api](http://localhost:8080/api)
- **Short Link Redirects:** e.g., `http://localhost:8080/alias`

## Step 4: Running Services Manually (Optional)

If you prefer to run the Backend and Frontend manually (for easier debugging and hot-reloading), follow these steps:

### 1. Start Infrastructure Only
Start Zookeeper and Kafka using Docker Compose:
```bash
docker-compose up -d zookeeper kafka
```

### 2. Start the Backend (Spring Boot)
Ensure `application.yml` is pointing to `localhost` for Kafka (it does by default). For the Database and Redis, ensure your `.env` contains the remote TiDB and Upstash credentials.
```bash
cd backend
mvn clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
# OR just run:
# mvn spring-boot:run
```

### 3. Start the Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

- **Database Connection Refused:** Make sure the `mysql` container is fully healthy. It takes about 10-15 seconds for MySQL to initialize on the first run.
- **Kafka connection issues:** Kafka depends on Zookeeper. Ensure both are running cleanly. If the backend fails to connect to Kafka, restart the backend container (`docker-compose restart backend`).
- **Nginx routing issues:** If you get a 404 on frontend page reloads, ensure the `nginx.conf` properly routes to `index.html` (this is handled in the Dockerfile).

## Creating Your First Admin User

Currently, users register via the UI with the `USER` role by default. If you need an `ADMIN` role to access the Blocked Domains page, you can manually update the user role in the MySQL database:

```bash
docker exec -it dragolink-mysql mysql -u root -proot dragolink -e "UPDATE users SET role='ADMIN' WHERE email='your@email.com';"
```
