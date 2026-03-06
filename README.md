# Task Manager API

This is the backend API for the Task Manager application. It provides endpoints for user authentication and task management.

## Prerequisites

- .NET 6.0 SDK or later
- SQL Server (LocalDB or Express)
- Visual Studio 2022 or Visual Studio Code

## Setup Instructions

1. **Install Required NuGet Packages**
   ```bash
   dotnet add package Microsoft.EntityFrameworkCore.SqlServer
   dotnet add package Microsoft.EntityFrameworkCore.Tools
   dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
   dotnet add package BCrypt.Net-Next
   ```

2. **Update Database Connection**
   - Open `appsettings.json`
   - Update the `DefaultConnection` string with your SQL Server details

3. **Create Database**
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

4. **Run the Application**
   ```bash
   dotnet run
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login and get JWT token

### Tasks
- GET `/api/task` - Get all tasks for the current user
- GET `/api/task/{id}` - Get a specific task
- POST `/api/task` - Create a new task
- PUT `/api/task/{id}` - Update a task
- DELETE `/api/task/{id}` - Delete a task
- GET `/api/task/status/{status}` - Get tasks by status
- GET `/api/task/pending` - Get pending tasks
- GET `/api/task/completed` - Get completed tasks

## Database Schema

### Users Table
- Id (Primary Key)
- Email (Unique)
- PasswordHash
- FirstName
- LastName
- CreatedAt

### Tasks Table
- Id (Primary Key)
- Title
- Description
- Priority
- Status
- DueDate
- CreatedAt
- CompletedAt
- UserId (Foreign Key)

## Security

- Passwords are hashed using BCrypt
- JWT authentication for API endpoints
- CORS enabled for Angular frontend (localhost:4200) 