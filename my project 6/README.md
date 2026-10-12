# Folio Notes

A full-stack notes app with a React/Vite interface, an Express API, and MongoDB storage. Write a note, choose its paper color, search the collection, edit it, or remove it.

---

## Ways to Open the Project

### Method 1 — Open Directly via Folder (No terminal needed)
You can open and use the app instantly right from Windows File Explorer:
1. Open the project folder: `c:\Users\HP PAVILION\Downloads\my project 6`
2. Double-click **`index.html`** in this root folder.
3. The app will open directly in your browser. It automatically detects and connects to the Express API if running on port 5000, or operates seamlessly in local folder mode (`localStorage`).

### Method 2 — 1-Click Launcher (Starts both servers)
Double-click **`run-app.bat`** in the project folder. It starts:
- Terminal 1: Backend Express API on port `5000`
- Terminal 2: Frontend Vite dev server on port `5173`

### Method 3 — Open Folder in File Explorer
Double-click **`open-folder.bat`** to open this project directory directly in Windows File Explorer.

### Method 4 — Standard Two Terminals (Full-Stack Dev Mode)

#### Terminal 1 — API and database connection
```bash
cd backend
npm install
npm start
```
Wait until the terminal confirms MongoDB is connected and the API is listening on port 5000.

#### Terminal 2 — React interface
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL printed in the terminal (usually `http://localhost:5173`).

The frontend proxies `/api` requests to the Express server. The API is available at `http://localhost:5000/api/notes`.

---

## Configure MongoDB

1. In `backend`, create a `.env` file (or copy `.env.example`).
2. Set `MONGO_URI` to your MongoDB connection string. For a local MongoDB server, use:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/folio_notes
   ```
3. Keep `backend/.env` private. It is excluded from Git.

---

## Notes API

| Method | Path | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Check API and MongoDB connection |
| `GET` | `/api/notes` | List notes (newest updated first) |
| `GET` | `/api/notes/:id` | Fetch one note |
| `POST` | `/api/notes` | Create a note |
| `PUT` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Remove a note |

---

## Notice

> Notes are shared by anyone using this demo because it does not include user accounts or access controls. Do not store sensitive information.
