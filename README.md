# 📦 Parcel Delivery Dashboard

## 🚀 Project Overview

The **Parcel Delivery Dashboard** is the official front-end for the Parcel Delivery API. It provides a user-friendly interface for managing, tracking, and interacting with the parcel delivery system.

<br>

**Key Features**:
* **User Authentication**: Secure login and logout with JWTs.
* **Role-Based Access**: Displays a custom dashboard for Admins, Senders, and Receivers.
* **Parcel Management**: Senders can create new parcels, view their status, and cancel shipments.
* **Admin Dashboard**: Admins have a comprehensive view of all parcels and can update their status (e.g., from `REQUESTED` to `PICKED`).
* **Real-time Tracking**: Publicly available parcel tracking using a unique tracking ID.
* **Responsive Design**: A modern, responsive UI built with Tailwind CSS.

---

## 🛠️ Tech Stack

* **Framework**: [React](https://reactjs.org/)
* **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) with [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) for data fetching.
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
* **Validation**: [Zod](https://zod.dev/)

---

## ⚙️ Setup Instructions

**Prerequisites**:
* **Node.js v18+**
* **Git**
* Access to the **Parcel Delivery Backend API**.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/masudsw/parcel-delivery-fronend.git](https://github.com/masudsw/parcel-delivery-fronend.git)
    cd parcel-delivery-fronend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Create your environment file**:
    ```bash
    cp .env.example .env
    ```
    For Windows users (PowerShell):
    ```powershell
    Copy-Item .env.example .env
    ```

### Environment Variables

Configure your `.env` file with the following variable, which should point to the base URL of your deployed backend API.

```bash
VITE_BACKEND_API_BASE_URL=[https://parcel-delevery-backend.vercel.app/api/v1](https://parcel-delevery-backend.vercel.app/api/v1)
