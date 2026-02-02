# User CRUD Stack (React + Tailwind + Express + MongoDB)

This repository contains a full-stack TypeScript project for managing users with full CRUD capabilities. The stack includes:

- **Client**: React + Vite + Tailwind CSS
- **Server**: Node.js + Express + Mongoose
- **Database**: MongoDB

## Project structure

```
.
├── client
└── server
```

## Prerequisites

- Node.js 18+
- MongoDB instance (local or hosted)

## Getting started

### 1) Server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The API runs on `http://localhost:4000` by default.

### 2) Client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The UI runs on `http://localhost:5173` by default and connects to the API via `VITE_API_URL`.

## API endpoints

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | `/api/users` | List users |
| GET | `/api/users/:id` | Fetch a single user |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

## Notes

- Ensure `MONGO_URI` is set in `server/.env` before starting the server.
- Emails must be unique.

## License

This project is licensed under the GNU GPL v3. See [LICENSE](LICENSE) for details.
