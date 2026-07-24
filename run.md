# How to Run Dragolink

This guide provides the necessary commands to start the Dragolink project locally. 

## Step 1: Environment Setup
First, create your environment variables file from the provided example:

```bash
cp .env.example .env
```
*(You can leave the default values as they are for local development).*

---

## Step 2: Start the Application

You can choose one of the two methods below to run the project.

### Method A: Using Docker Compose (Recommended)
This is the easiest method and will automatically start the frontend, backend, database, and message brokers.

Run this command in the root of the project:
```bash
docker-compose up -d --build
```

*(Optional) Clean Restart:* If you face container startup issues or want to wipe your local cache/queues and start completely fresh, use this command instead:
```bash
docker-compose down -v && docker-compose up -d --build
```

**Access Points:**
- Frontend App: http://localhost:5173
- Backend API: http://localhost:8080/api

---

### Method B: Running Services Manually
If you want to run the application manually (useful for active development or hot-reloading), follow these steps in order:

**1. Start the Infrastructure (Database, Cache, Brokers)**
```bash
docker-compose up -d mysql redis zookeeper kafka
```

**2. Start the Backend (Spring Boot)**
Open a new terminal and run:
```bash
cd backend
mvn spring-boot:run
```

**3. Start the Frontend (React + Vite)**
Open another terminal and run:
```bash
cd frontend
npm install
npm run dev
```

---

## Stopping the Application
To stop all services if you used Docker Compose, run:
```bash
docker-compose down
```
