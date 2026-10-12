const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));   // parse form POST bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve static assets

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Routes ────────────────────────────────────────────────────────────────────

// Home
app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// About
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// Contact – GET
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact', message: null, error: null });
});

// Contact – POST
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Basic server-side validation
  if (!name || !email || !message) {
    return res.render('contact', {
      title: 'Contact',
      message: null,
      error: 'All fields are required.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.render('contact', {
      title: 'Contact',
      message: null,
      error: 'Please enter a valid email address.',
    });
  }

  // Message is validated but not stored or emailed
  return res.render('contact', {
    title: 'Contact',
    message: `Thanks, ${name}! Your message has been received.`,
    error: null,
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Server running at http://localhost:${PORT}`);
});
