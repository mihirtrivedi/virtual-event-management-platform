# Virtual Event Management Platform (Backend)

A secure Node.js backend for managing virtual events, featuring user authentication, role-based access control, and asynchronous email notifications.

## 🚀 Features
- **Secure Authentication**: User registration and login using `bcryptjs` (password hashing) and `JWT` (session management).
- **In-Memory Data Store**: Efficient data management using JavaScript arrays (no external database required).
- **Event Management (CRUD)**: Create, View, Update, and Delete event details (restricted to Organizers).
- **Participant Management**: Attendees can register for events and view their own registration dashboard.
- **Asynchronous Notifications**: Automatic registration confirmation emails sent via **Nodemailer** (Ethereal Email).

## 🛠️ Tech Stack
- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Security**: jsonwebtoken, bcryptjs
- **Testing**: Jest, Supertest
- **Mailing**: Nodemailer

## 📥 Installation & Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com
   cd virtual-event-management-platform
