require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the uploads folder as the destination
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Add timestamp to avoid overwriting
  }
});

// File type and size validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and JPEG are allowed.'), false); // Reject the file
  }
};

const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: fileFilter,
});

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET; // JWT secret from .env
const mongoUri = process.env.MONGO_URI; // MongoDB URI from .env

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// MongoDB Connection
mongoose.set('strictQuery', true);
mongoose.connect(mongoUri).then(() => {
    console.log('MongoDB connection successful');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Register user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = await User.create({ username, password: hashedPassword });
    res.status(201).json(userDoc);
  } catch (e) {
    res.status(500).json({ error: 'Registration failed', message: e.message });
  }
});

// Login user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true }).json({ id: userDoc._id, username });
    });
  } catch (e) {
    res.status(500).json({ error: 'Login failed', message: e.message });
  }
});

// Get user profile
app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    res.json(info);
  });
});

// Logout user
app.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true }).json({ message: 'Logged out successfully' });
});

// Create a new post
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { originalname, path } = req.file;
    const ext = originalname.split('.').pop();
    const newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) return res.status(401).json({ error: 'Unauthorized' });

      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.status(201).json(postDoc);
    });
  } catch (e) {
    res.status(500).json({ error: 'Post creation failed', message: e.message });
  }
});

// Update post
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    const { id, title, summary, content } = req.body;
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const ext = originalname.split('.').pop();
      newPath = `${path}.${ext}`;
      fs.renameSync(path, newPath);
    }

    const postDoc = await Post.findById(id);
    if (!postDoc) return res.status(404).json({ error: 'Post not found' });

    if (String(postDoc.author) !== String(info.id)) {
      return res.status(403).json({ error: 'You are not the author of this post' });
    }

    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath || postDoc.cover,
    });
    res.json({ message: 'Post updated successfully' });
  });
});

// Fetch all posts
app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch posts', message: e.message });
  }
});

// Fetch a single post
app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id).populate('author', ['username']);
    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(postDoc);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch post', message: e.message });
  }
});

// Like a post (Toggle Like)
app.post('/post/:id/like', async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify the token and get user info
  jwt.verify(token, secret, {}, async (err, userInfo) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    try {
      // Find the post by ID
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Check if the user has already liked the post
      const isLiked = post.likes.includes(userInfo.id);

      if (isLiked) {
        // User has already liked, so remove like
        post.likes = post.likes.filter((userId) => userId.toString() !== userInfo.id.toString());
      } else {
        // User has not liked, so add like
        post.likes.push(userInfo.id);
      }

      // Save the updated post
      await post.save();

      // Respond with the updated likes array count
      res.json({ likes: post.likes.length });
    } catch (e) {
      res.status(500).json({ error: 'Failed to like post', message: e.message });
    }
  });
});

// Start the server
app.listen(4000, () => {
  console.log('Server running on port 4000');
});
