Recipe API - README

📌 Project Overview

The Recipe API is a backend service that allows users to manage their favorite recipes. Users can register, authenticate, and store their own recipes with details like title, ingredients, and preparation steps.

🛠 Setup Instructions

1. Clone the repository

git clone <repository_url>
cd recipe-api

2. Install dependencies

npm install

3. Set up environment variables

Create a .env file in the root directory and add:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/recipes
JWT_SECRET=5ab37f9370946ea6e33f6fec0a7ead248db1cbdf594def7a18a55a2320243a114f1cb24163c9f5925518e3e67ee970fcc28d39f27fc9d1f9d1647ac2a3b3c5e0

4. Run the server

npm start

The server will start on http://localhost:5000.

🗄 Database Schema (MongoDB)

The project has two main collections:

1. User Collection

{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "password": "string (hashed)"
}

2. Recipe Collection

{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "ingredients": ["string"],
  "instructions": "string",
  "createdBy": "ObjectId (User ID)",
  "createdAt": "Date"
}

🔥 API Endpoints

Authentication (Public)

POST /register → Register a new user

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "securepassword"
}

POST /login → Authenticate user & return JWT

{
  "email": "test@example.com",
  "password": "securepassword"
}

User Management (Private)

GET /users/profile → Get logged-in user's profile

PUT /users/profile → Update user's profile

{
  "username": "newname",
  "email": "new@example.com"
}

Recipe Management (Private)

POST /recipes → Create a new recipe

{
  "title": "Pasta Carbonara",
  "description": "A classic Italian pasta dish.",
  "ingredients": ["Pasta", "Eggs", "Parmesan", "Bacon"],
  "instructions": "Cook pasta, mix with eggs and cheese, add bacon."
}

GET /recipes → Get all recipes for the logged-in user

GET /recipes/:id → Get a specific recipe by ID

PUT /recipes/:id → Update a recipe

DELETE /recipes/:id → Delete a recipe

🔒 Authentication & Security

JWT Authentication: All private routes require a valid token.

Password Hashing: Uses bcrypt for secure password storage.

Middleware: Protects routes by verifying JWT tokens.

⚠️ Validation & Error Handling

Data Validation: Joi is used to validate request payloads.

Error Handling:

Returns 400 for bad requests.

Returns 401 for unauthorized access.

Uses a global error handler middleware.

👥 Team Members

Ariyat T

Dulat E

Adilhan S
