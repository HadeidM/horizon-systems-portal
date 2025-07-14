# Horizon Systems Portal

This is a full-stack web application with an Angular frontend and a .NET Core backend.

## Technologies Used

### Frontend

* [Angular](https://angular.io/)
* [Tailwind CSS](https://tailwindcss.com/)

### Backend

* [.NET 7](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
* [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
* [SQL Server](https://www.microsoft.com/en-us/sql-server)

## How to Run

### Prerequisites

* [.NET 7 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
* [Node.js](https://nodejs.org/en/)
* [Angular CLI](https://cli.angular.io/)
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

### Backend

1.  Navigate to the `webapi` directory.
2.  Update the connection string in `appsettings.json` to point to your SQL Server instance.
3.  Run `dotnet restore`.
4.  Run `dotnet ef database update` to apply the migrations.
5.  Run `dotnet run` to start the backend server.

### Frontend

1.  Navigate to the `angularapp` directory.
2.  Run `npm install`.
3.  Run `npm start` to start the frontend development server.
4.  Open your browser to `https://localhost:4200/`.

## Available Scripts

### Frontend

*   `ng serve`: Starts the development server.
*   `ng build`: Builds the application.
*   `ng test`: Runs the unit tests.
*   `ng lint`: Lints the application.
