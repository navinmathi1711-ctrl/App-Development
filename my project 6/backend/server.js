import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import Note from './models/Note.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/folio_notes';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// State for database connection & in-memory fallback
let isMongoConnected = false;
let memoryNotes = [
  {
    _id: 'sample-1',
    id: 'sample-1',
    title: 'Welcome to Folio Notes',
    content: 'Write a note, choose its paper color, search the collection, edit it, or remove it.\n\nFolio Notes is a tactile full-stack notes workspace with an Express API, React/Vite interface, and MongoDB persistence.',
    color: '#FEF9C3', // Warm Cream
    pinned: true,
    tags: ['welcome', 'folio'],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'sample-2',
    id: 'sample-2',
    title: 'Paper Color Swatches',
    content: 'Every idea deserves its own paper feel. Try clicking the color swatches below to change paper tones between Cream, Sage, Peach, Rose, Sky, and Lavender.',
    color: '#DCFCE7', // Sage Green
    pinned: false,
    tags: ['design', 'colors'],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    _id: 'sample-3',
    id: 'sample-3',
    title: 'MongoDB Connection Guide',
    content: 'For MongoDB local storage, start MongoDB locally or configure MONGO_URI in backend/.env with your Atlas cluster string.',
    color: '#FFEDD5', // Warm Amber/Peach
    pinned: false,
    tags: ['mongodb', 'setup'],
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
  },
];

// Helper to determine if an ID is a valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Connect to MongoDB
async function connectDatabase() {
  console.log(`[Folio Notes] Attempting connection to MongoDB at: ${MONGO_URI}`);
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log(`[Folio Notes] MongoDB is connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`);
    
    // Seed initial welcome note if collection is empty
    const count = await Note.countDocuments();
    if (count === 0) {
      await Note.insertMany(
        memoryNotes.map((n) => ({
          title: n.title,
          content: n.content,
          color: n.color,
          pinned: n.pinned,
          tags: n.tags,
        }))
      );
      console.log('[Folio Notes] Initial welcome notes seeded into MongoDB collection.');
    }
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[Folio Notes] Warning: Could not connect to MongoDB (${error.message}).`);
    console.warn('[Folio Notes] Operating with in-memory fallback store so API and React UI remain fully functional.');
    console.warn('[Folio Notes] Once your local MongoDB or Atlas MONGO_URI is ready, restart the server.');
  }
}

mongoose.connection.on('connected', () => {
  isMongoConnected = true;
  console.log('[Folio Notes] MongoDB connection established.');
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.log('[Folio Notes] MongoDB disconnected.');
});

// ==========================================
// API ROUTES
// ==========================================

/**
 * GET /api/health
 * Check API status and MongoDB connection
 */
app.get('/api/health', async (req, res) => {
  let noteCount = memoryNotes.length;
  if (isMongoConnected) {
    try {
      noteCount = await Note.countDocuments();
    } catch {
      // ignore
    }
  }

  res.json({
    status: 'ok',
    message: 'Folio Notes API is healthy',
    timestamp: new Date().toISOString(),
    database: {
      connected: isMongoConnected,
      status: isMongoConnected ? 'connected' : 'fallback_memory',
      uri: MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'),
      notesCount: noteCount,
    },
    uptime: process.uptime(),
  });
});

/**
 * GET /api/notes
 * List notes (newest updated first) with optional search & filter
 */
app.get('/api/notes', async (req, res) => {
  const { q, color, pinned } = req.query;

  try {
    if (isMongoConnected) {
      const query = {};

      if (q && q.trim()) {
        const regex = new RegExp(q.trim(), 'i');
        query.$or = [{ title: regex }, { content: regex }, { tags: regex }];
      }

      if (color && color.trim()) {
        query.color = color.trim();
      }

      if (pinned !== undefined) {
        query.pinned = pinned === 'true';
      }

      // Notes sorted newest updated first
      const notes = await Note.find(query).sort({ pinned: -1, updatedAt: -1 });
      return res.json(notes);
    }

    // In-memory fallback
    let results = [...memoryNotes];

    if (q && q.trim()) {
      const lowerQ = q.trim().toLowerCase();
      results = results.filter(
        (n) =>
          n.title.toLowerCase().includes(lowerQ) ||
          n.content.toLowerCase().includes(lowerQ) ||
          (n.tags && n.tags.some((t) => t.toLowerCase().includes(lowerQ)))
      );
    }

    if (color && color.trim()) {
      results = results.filter((n) => n.color.toLowerCase() === color.trim().toLowerCase());
    }

    if (pinned !== undefined) {
      const isPinned = pinned === 'true';
      results = results.filter((n) => Boolean(n.pinned) === isPinned);
    }

    // Sort newest updated first (with pinned on top)
    results.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return res.json(results);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes', details: error.message });
  }
});

/**
 * GET /api/notes/:id
 * Fetch one note by ID
 */
app.get('/api/notes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid Note ID format' });
      }
      const note = await Note.findById(id);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      return res.json(note);
    }

    // In-memory fallback
    const note = memoryNotes.find((n) => n._id === id || n.id === id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    return res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note', details: error.message });
  }
});

/**
 * POST /api/notes
 * Create a new note
 */
app.post('/api/notes', async (req, res) => {
  const { title, content, color, pinned, tags } = req.body;

  const noteTitle = title !== undefined && title.trim() !== '' ? title.trim() : 'Untitled Note';
  const noteContent = content !== undefined ? content : '';
  const noteColor = color || '#FEF9C3';
  const isPinned = Boolean(pinned);
  const noteTags = Array.isArray(tags) ? tags : [];

  try {
    if (isMongoConnected) {
      const newNote = new Note({
        title: noteTitle,
        content: noteContent,
        color: noteColor,
        pinned: isPinned,
        tags: noteTags,
      });

      const savedNote = await newNote.save();
      return res.status(201).json(savedNote);
    }

    // In-memory fallback
    const newId = 'note-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();
    const createdNote = {
      _id: newId,
      id: newId,
      title: noteTitle,
      content: noteContent,
      color: noteColor,
      pinned: isPinned,
      tags: noteTags,
      createdAt: now,
      updatedAt: now,
    };
    memoryNotes.unshift(createdNote);
    return res.status(201).json(createdNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note', details: error.message });
  }
});

/**
 * PUT /api/notes/:id
 * Update an existing note
 */
app.put('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, color, pinned, tags } = req.body;

  try {
    if (isMongoConnected) {
      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid Note ID format' });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title.trim() || 'Untitled Note';
      if (content !== undefined) updateData.content = content;
      if (color !== undefined) updateData.color = color;
      if (pinned !== undefined) updateData.pinned = Boolean(pinned);
      if (tags !== undefined && Array.isArray(tags)) updateData.tags = tags;

      const updatedNote = await Note.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedNote) {
        return res.status(404).json({ error: 'Note not found' });
      }

      return res.json(updatedNote);
    }

    // In-memory fallback
    const index = memoryNotes.findIndex((n) => n._id === id || n.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const existing = memoryNotes[index];
    const updatedNote = {
      ...existing,
      title: title !== undefined ? (title.trim() || 'Untitled Note') : existing.title,
      content: content !== undefined ? content : existing.content,
      color: color !== undefined ? color : existing.color,
      pinned: pinned !== undefined ? Boolean(pinned) : existing.pinned,
      tags: tags !== undefined && Array.isArray(tags) ? tags : existing.tags,
      updatedAt: new Date().toISOString(),
    };

    memoryNotes[index] = updatedNote;
    return res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note', details: error.message });
  }
});

/**
 * DELETE /api/notes/:id
 * Remove a note
 */
app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid Note ID format' });
      }

      const deletedNote = await Note.findByIdAndDelete(id);
      if (!deletedNote) {
        return res.status(404).json({ error: 'Note not found' });
      }

      return res.json({
        message: 'Note removed successfully',
        id: deletedNote._id,
      });
    }

    // In-memory fallback
    const index = memoryNotes.findIndex((n) => n._id === id || n.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const removed = memoryNotes.splice(index, 1)[0];
    return res.json({
      message: 'Note removed successfully',
      id: removed._id,
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to remove note', details: error.message });
  }
});

// Start Express server and initiate DB connection
app.listen(PORT, async () => {
  console.log(`[Folio Notes] API is listening on port ${PORT}`);
  console.log(`[Folio Notes] Available at: http://localhost:${PORT}/api/notes`);
  console.log(`[Folio Notes] Health check: http://localhost:${PORT}/api/health`);
  await connectDatabase();
});
