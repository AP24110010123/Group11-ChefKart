# ChefKart - Home Chef Booking Platform

## Project Overview
ChefKart is a full-stack web application developed using the MERN stack (MongoDB, Express.js, React.js, Node.js). 
The platform connects users with professional chefs, allowing users to book chefs for cooking services at home.

## Features
User Features:
- User registration and login
- Search and filter chefs by cuisine and availability
- View chef profiles (skills, experience, pricing)
- Book chefs for specific date and time
- Secure online payment integration
- Provide ratings and reviews

Chef Features:
- Create and manage profile
- Set availability and pricing
- Accept or reject booking requests
- Earn income through bookings

Admin Features:
- Monitor users and chefs
- Manage bookings and platform activity
- Maintain system operations

Subscription Features:
- Monthly/weekly subscription plans
- Discounted pricing for regular users
- Priority booking access

## Technologies Used
Frontend:
- React.js
- HTML, CSS
- Axios
- React Router

Backend:
- Node.js
- Express.js
- JWT Authentication
- Bcrypt

Database:
- MongoDB
- Mongoose

Tools:
- Git & GitHub
- VS Code
- Postman / Thunder Client

## Project Structure
- frontend/ → React application
- backend/ → Node.js server
- models/ → Database schemas
- controllers/ → Business logic
- routes/ → API endpoints
- middleware/ → Authentication

## Installation Steps
1. Clone the repository:
   git clone <your-repo-link>

2. Install frontend dependencies:
   cd frontend
   npm install
   npm run dev

3. Install backend dependencies:
   cd backend
   npm install
   npm start

4. Configure environment variables in .env:
   - MongoDB URI
   - JWT Secret
   - Razorpay keys

5. Open browser:
   http://localhost:3000

## Usage
- Register/Login as a user
- Browse available chefs
- Book a chef and make payment
- Leave ratings and reviews
- Admin can monitor system activity

## Conclusion
ChefKart simplifies the process of booking chefs by providing a centralized platform 
that connects users and chefs efficiently. It enhances convenience for users and 
creates income opportunities for chefs.
