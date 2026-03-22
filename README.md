# Accounting System Frontend

This project is the frontend part of a full accounting system built using Angular.  
It provides a clean and responsive user interface to manage financial data, handle user interactions, and communicate with the backend APIs.

---

## Overview

The application is designed to help users manage financial transactions in a simple and organized way.

It includes features like authentication, dashboards, and transaction management, all built with a focus on usability and performance.

The frontend communicates with a Node.js backend through REST APIs.

---

## Technologies Used

- Angular
- TypeScript
- Angular Router
- Reactive Forms
- HTTP Client
- CSS / SCSS

---

## Main Features

- User authentication (login / register)
- Form validation using Reactive Forms
- Dashboard with summarized data
- Add, edit, and delete transactions
- Organized and reusable components
- Route protection using guards
- API integration with backend services
- Responsive design

---

## Application Structure

The project is structured in a clean and modular way:

- components: reusable UI components
- pages: main views (login, dashboard, transactions)
- services: handle API communication
- guards: protect routes based on authentication
- models: define data structures
- interceptors: handle HTTP requests (like adding tokens)

This structure makes the project easier to scale and maintain.

---

## Authentication Flow

- The user logs in and receives a token from the backend
- The token is stored (localStorage or sessionStorage)
- An HTTP interceptor automatically attaches the token to requests
- Route guards prevent unauthorized access to protected pages

---

## Forms & Validation

- Built using Angular Reactive Forms
- Includes validation for required fields and correct data formats
- Provides user-friendly error messages

---

## API Integration

The frontend communicates with backend APIs using Angular HTTP Client.

- All API calls are handled through services
- Base URL is configurable
- Error handling is implemented for failed requests

---

## Setup Instructions

1. Clone the repository

git clone https://github.com/your-username/accounting-system-frontend.git

2. Install dependencies

npm install

3. Run the project

ng serve

4. Open in browser

http://localhost:4200

---

## Notes

This project was built as part of a full-stack accounting system to practice building real-world applications using Angular and integrating them with backend services.

---

## Author

Nardeen Samuel
