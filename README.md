# 🚗 Vehicle Rental System

**Live URL:**    https://vehicle-rental-system-theta-eight.vercel.app/

---

## Overview

Backend API for managing vehicles, customers, and bookings with role-based access:

- **Vehicles:** Add, update, delete, track availability  
- **Customers:** Manage accounts & profiles  
- **Bookings:** Create, cancel, return vehicles  
- **Authentication:** JWT-based with admin/customer roles  

---

## Tech Stack

- Node.js + TypeScript  
- Express.js  
- PostgreSQL  
- bcrypt (password hashing)  
- jsonwebtoken (JWT auth)  

---

## Database Tables

### Users
`id, name, email, password, phone, role ('admin'/'customer')`  

### Vehicles
`id, vehicle_name, type, registration_number, daily_rent_price, availability_status ('available'/'booked')`  

### Bookings
`id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status ('active','cancelled','returned')`  

---

## API Endpoints

### Auth
- `POST /api/v1/auth/signup` – Register  
- `POST /api/v1/auth/signin` – Login  

### Vehicles
- `GET /api/v1/vehicles` – List all  
- `GET /api/v1/vehicles/:id` – Vehicle details  
- `POST /api/v1/vehicles` – Admin: Add  
- `PUT /api/v1/vehicles/:id` – Admin: Update  
- `DELETE /api/v1/vehicles/:id` – Admin: Delete  

### Users
- `GET /api/v1/users` – Admin: List all  
- `PUT /api/v1/users/:id` – Admin/self update  
- `DELETE /api/v1/users/:id` – Admin: Delete  

### Bookings
- `POST /api/v1/bookings` – Create booking  
- `GET /api/v1/bookings` – Admin/all or Customer/own  
- `PUT /api/v1/bookings/:id` – Cancel/Return  

---

## Setup

1. Clone & install
```bash
git clone https://github.com/Monwar23/Vehicle-Rental-System.git
cd vehicle-rental-system
npm install
setup .env->
  CONNECTION_STR = Your PostgreSQL_Connection_String
  PORT = Your port
  JWT_SECRET = Your JWT token
npm run dev

