# Basic Node.js Web Server

A small multi-page website served with **Node.js** and **Express**.

## Pages

| Page    | URL        |
|---------|------------|
| Home    | `/`        |
| About   | `/about`   |
| Contact | `/contact` |

## Run Locally

1. Open a terminal in this folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

> Set the `PORT` environment variable to use a different port:
> ```bash
> PORT=8080 npm start
> ```

## Project Structure

```
my project 4/
├── server.js            # Express server & routes
├── package.json
├── public/
│   └── css/
│       └── style.css    # All styles
└── views/
    ├── home.ejs
    ├── about.ejs
    ├── contact.ejs
    ├── 404.ejs
    └── partials/
        ├── header.ejs
        └── footer.ejs
```

## Notes

- The contact form demonstrates a **server-side POST route**.
- Messages are **validated but not stored or emailed**.
- Uses [EJS](https://ejs.co/) for server-side HTML templating.
