# ReachHomes Admin Dashboard & Backend

This repository contains the full-stack application for ReachHomes, a luxury property management platform.

## Architecture

*   **Frontend**: React, Vite, Tailwind CSS, Framer Motion.
*   **Backend**: Node.js, Express.
*   **Database**: SQLite (for preview/development), MySQL (for production via Docker).
*   **Routing & Load Balancing**: Traefik (via Docker).

## Development Setup (Preview Environment)

In the preview environment, the application runs using `tsx` to serve both the Express backend and the Vite frontend. It uses an in-memory/local SQLite database.

1.  Install dependencies:
    \`\`\`bash
    npm install
    \`\`\`
2.  Start the development server:
    \`\`\`bash
    npm run dev
    \`\`\`
    This will start the server on port 3000.

## Production Setup (Docker)

The application is fully containerized and designed to handle 1000+ concurrent users. It uses a custom Docker network, Traefik for routing, and MySQL for the database.

1.  Ensure Docker and Docker Compose are installed.
2.  Run the following command to start the entire stack:
    \`\`\`bash
    docker-compose up -d
    \`\`\`

### Docker Services

*   **traefik**: Reverse proxy and load balancer. Listens on port 80.
*   **db**: MySQL 8.0 database.
*   **backend**: Node.js Express API server.
*   **frontend**: Nginx serving the built React application.

### Custom Network

The application uses a custom bridge network named `reachhomes_network` to ensure secure communication between containers.

## Features

*   **Role-Based Access Control (RBAC)**: Different dashboards and permissions for Super Admin (Juan), Geo Managers, Cluster Managers, Owners, Collaborators, Partners, and Clients.
*   **Real-time Dashboards**: Simulated real-time metrics for system health, revenue, and occupancy.
*   **Property Management**: View and manage luxury properties, profiles, and reservations.
*   **Task Management**: Assign and track tasks for employees with checklists.
*   **Audit & Compliance**: Track user journeys and system events.

## API Endpoints

*   \`GET /api/health\`: Check system health.
*   \`GET /api/users\`: Retrieve all users.
*   \`POST /api/users\`: Create a new user.
*   \`GET /api/properties\`: Retrieve all properties.
*   \`GET /api/reservations\`: Retrieve all reservations.

## Database Schema

The database consists of the following core tables:
*   \`users\`: Stores user accounts and roles.
*   \`properties\`: Stores property details.
*   \`reservations\`: Stores booking information.

*(Note: The full schema includes 20+ normalized tables for multi-tenant hierarchy and auditability, as visualized in the Schema Viewer module).*
