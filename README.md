# Movie Database API

## Description

This is a NestJS application that integrates with The Movie Database (TMDB) API to fetch and manage movie data. The application provides endpoints for retrieving popular movies with high ratings and stores them in a MongoDB database.

## Features

- Integration with TMDB API for movie data retrieval
- MongoDB persistence layer for movie storage
- RESTful API endpoints for movie management
- Environment-based configuration

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
  ```bash
  # Check Node.js version
  node --version
  ```
- MongoDB (v4.4 or higher)
  ```bash
  # Check MongoDB version
  mongod --version
  ```
- TMDB API access token (Get it from [TMDB website](https://www.themoviedb.org/documentation/api))

## Detailed Installation Guide

1. **Clone the repository:**
```bash
git clone <repository-url>
cd movie-database-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **MongoDB Setup:**
   - Start MongoDB service:
     ```bash
     # On Linux/Mac
     sudo service mongod start
     # Or
     brew services start mongodb-community

     # On Windows (run as administrator)
     net start MongoDB
     ```
   - Verify MongoDB is running:
     ```bash
     mongo
     # Or
     mongosh
     ```

4. **Environment Configuration:**
   ```bash
   # Create .env file from example
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:
   ```bash
   # Required settings
   TMDB_API_KEY=your_tmdb_api_key        # Get this from TMDB website
   MONGODB_URI=mongodb://localhost:27017/movies
   PORT=3000

   # Optional settings
   NODE_ENV=development                   # development or production
   ```

## Running the Application

### Development Mode
```bash
# Start the application in development mode with hot-reload
npm run start:dev

# The application will be available at http://localhost:3000
```

### Production Mode
```bash
# Build the application
npm run build

# Start the production server
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

## Modules

### Persistence Module
- Handles all database operations
- Provides endpoints for managing movie data in MongoDB
- Implements CRUD operations for movies

### Retrieve Module
- Manages the integration with TMDB API
- Handles fetching movie data from the external service
- Processes and transforms TMDB data format

## API Endpoints

The following endpoints are available:

### Movie Management (via Persistence Controller)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/movies` | Retrieve all movies |
| GET | `/movies/:id` | Retrieve a specific movie |
| POST | `/movies` | Create a new movie |
| PUT | `/movies/:id` | Update an existing movie |
| DELETE | `/movies/:id` | Delete a movie |
