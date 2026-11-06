========================================================================
                 INVENTORY MANAGEMENT APPLICATION
                         DOCUMENTATION
========================================================================

1. SYSTEM OVERVIEW
------------------------------------------------------------------------
This application is a full-stack Inventory Management solution designed
with a modern tech stack:
  - Frontend: Angular (Standalone components, Reactive Forms, SCSS)
  - Backend:  ASP.NET Core Web API (C#, LINQ)
  - Database: SQLite (Relational, file-based embedded database)
  - Security: Angular Auth Guards for route protection

Key Features:
  - Default Admin Authentication
  - Server-side filtering (Search terms, Price ranges via LINQ)
  - Inline stock level quick controls (+ and - buttons)
  - Full CRUD operations with instant UI reactivity
  - Custom floating success Toast notifications


2. DEFAULT ACCESS CREDENTIALS
------------------------------------------------------------------------
To log in to the application, use the following pre-configured 
administrator account:

   Username: admin
   Password: admin123

These credentials allow access to the protected inventory dashboard.


3. HOW TO RUN LOCALLY
------------------------------------------------------------------------

Prerequisites:
  - .NET SDK (version 7.0 or higher)
  - Node.js (LTS version recommended)
  - Angular CLI (npm install -g @angular/cli)

------------------------------------------------------------------------
Step 1: Start the Backend (.NET Web API)
------------------------------------------------------------------------
1. Open a terminal and navigate to the backend project root folder:
     cd path/to/your/backend

2. Restore NuGet dependencies:
     dotnet restore

3. Run the API project:
     dotnet run

The backend API will start running (typically at https://localhost:7143).

------------------------------------------------------------------------
Step 2: Start the Frontend (Angular)
------------------------------------------------------------------------
1. Open a new terminal window and navigate to the Angular client folder:
     cd path/to/your/frontend/product-client

2. Install Node dependencies:
     npm install

3. Run the development server:
     ng serve

4. Open your browser and go to:
     http://localhost:4200


4. APPLICATION ARCHITECTURE & FEATURES
------------------------------------------------------------------------
- Route Guard (authGuard): Ensures unauthenticated users are redirected 
  to the /login page if they attempt to access /products directly.
- Server-Side Querying: Filtering parameters (search, minPrice, maxPrice) 
  are sent directly via HttpParams to execute optimized SQL queries.
- UI Reactivity: State changes trigger immediate ChangeDetectorRef 
  updates to keep the interface perfectly synchronized.
- Logout Feature: Clear stored user credentials from local storage and 
  redirect safely back to the login screen.
================================================----------------========
