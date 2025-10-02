# MartCom

The e-commerce web application is designed as an end-to-end solution for online shopping, integrating functionalities for both customers and administrators. It serves as a standalone platform that includes:
• A user-friendly interface for customers to browse, search, and purchase products.
• Administrative tools for managing product listings, inventory, and orders.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Docker installed on your machine.
- Git installed on your machine.
- PostgreSQL Docker image pulled or available in Docker Hub.

## Setup Instructions

### Step 1: Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/Ahsan-4894/Ecommerce-Web-App.git
cd your-repository-name
```

### Step 2: Set Up Environment Variables

• Create a .env file in the server directory (or in the appropriate directory where backend environment variables are defined).
• Add the necessary variables for your database and server settings:
PORT = <backend_port> "3000"
USER = <username_of_postgresql> "postgres"
HOST = <databse_service_name> "martcom-postgresql-1"
DATABASE = <name_of_database> "ecommerce"
PASSWORD = <password_of_database>
DATABASE_PORT = <database_port_of_that_container>"5432"

JWT_SECRET_KEY = <JWT_SECRET_FOR_AUTH>

CLOUDINARY_NAME=<name_of_cloudinary>
CLOUDINARY_API_KEY=<Its_API_KEY>
CLOUDINARY_API_SECRET=<Its_API_SECRET>

EMAIL_HOST=<protocol>'smtp.gmail.com'
EMAIL_PORT=<Its_PORT>'587'
EMAIL_USER=<sender_email>abc@gmail.com
EMAIL_PASS=<app_password>xyz #generate app password

### Step 3: Running the Docker Containers

```bash
docker-compose up -d
```

This will start the backend, frontend, and PostgreSQL containers.

### Step 4: Importing Database Backup (Optional)

    1- Copy that backup file (eg, .dump) to postgresql container by this command:
        ```bash
            docker cp <path>/backup.dump <container_name>martcom-postgresql-1:./backup.dump
        ```
    2- Create database first with the same name as in your local machine (do in bash)
    	```bash
            psql -U <POSTGRES_USER> -c "CREATE DATABASE '<database_name>';"
        ```

    3- Now restore that file
        ```bash
            pg_restore -U <POSTGRES_USER> -d <database_name> --clean --no-owner <path>/backup.dump
        ```

### Step 5: Accessing the Application

• Frontend: Access the frontend application by navigating to http://localhost:3000 in your browser.
• Backend: The backend server will be running on port 3000 (or the port defined in your .env file).
• Database: You can access the database through a tool like pgAdmin by connecting to martcom-postgresql-1:5432 (or the PostgreSQL service name and port).

### Step 6: Stopping the Services

```bash
docker-compose down
```
