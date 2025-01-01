# Movie Database API

## Description

This is a NestJS application that integrates with The Movie Database (TMDB) API to fetch and manage movie data. The application provides endpoints for retrieving popular movies with high ratings and stores them in a MongoDB database.

## Features

- Integration with TMDB API for movie data retrieval
- MongoDB persistence layer for movie storage
- RESTful API endpoints for movie management
- Docker containerization for easy deployment
- Environment-based configuration

## Prerequisites

Before you begin, ensure you have the following:
- Docker and Docker Compose installed
  ```bash
  # Check Docker version
  docker --version
  
  # Check Docker Compose version
  docker compose version
  ```
- TMDB API access token (Get it from [TMDB website](https://www.themoviedb.org/documentation/api))

## Installation and Setup

### Using Docker (Recommended)

1. **Clone the repository:**
```bash
git clone <repository-url>
cd movie-database-api
```

2. **Configure environment variables:**
```bash
# Create .env file from example
cp .env.example .env
```

Edit the `.env` file with your TMDB API credentials:
```bash
TMDB_API_KEY=your_tmdb_api_key
TMDB_API_ACCESS_TOKEN=your_access_token
```

3. **Build and run with Docker Compose:**
```bash
# Build and start the containers
docker compose up -d

# View logs
docker compose logs -f

# Stop the containers
docker compose down
```

The application will be available at http://localhost:3000

### Manual Setup (Without Docker)

If you prefer to run the application without Docker, you'll need:
- Node.js (v22.3 or higher)
- MongoDB (v4.4 or higher)

1. **Install dependencies:**
```bash
npm install
```

2. **Configure MongoDB:**
   - Start MongoDB service
   - Update MONGODB_URI in .env to point to your MongoDB instance

3. **Start the application:**
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Project Structure

```bash
src/
├── entities/                  # Database models/schemas
│   └── movie.entity.ts       # Movie entity definition
├── persistence/              # Database operations
│   ├── persistence.module.ts
│   ├── persistence.service.ts
│   └── persistence.controller.ts
├── retrieve/                 # TMDB API integration
│   └── retrieve.module.ts
└── main.ts                   # Application entry point
```

## API Endpoints

### Movie Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/movies` | Retrieve all movies |
| GET | `/movies/:id` | Retrieve a specific movie |
| POST | `/movies` | Create a new movie |
| PUT | `/movies/:id` | Update an existing movie |
| DELETE | `/movies/:id` | Delete a movie |

## Docker Configuration

The application uses Docker Compose to manage two services:

1. **Application Service (app)**
   - Built from the Dockerfile
   - Runs the NestJS application
   - Exposes port 3000

2. **MongoDB Service (mongodb)**
   - Uses official MongoDB image
   - Persistent data storage using Docker volumes
   - Exposes port 27017

### Docker Commands

```bash
# Build the images
docker compose build

# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Stop services and remove volumes
docker compose down -v
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| TMDB_API_KEY | Your TMDB API key | - |
| TMDB_API_ACCESS_TOKEN | Your TMDB API access token | - |
| TMDB_API_URL | TMDB API base URL | https://api.themoviedb.org/3 |
| MONGODB_URI | MongoDB connection string | mongodb://mongodb:27017/netflix |
| PORT | Application port | 3000 |
