const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const cloudinary = require('cloudinary').v2; // Cloudinary package
const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dxquyqjvn',
  api_key: 253331366273788,
  api_secret: 'jWhtn9guLzXg_1otDWAeGvcGdwM',
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user with additional fields
    user = new User({
      username,
      email,
      password: hashedPassword,
      profilePic: 'default_profile_pic_url', // Default profile pic
      posts: [],
      followers: [],
      following: []
    });

    // Save the user to the database
    await user.save();

    // Create a JWT payload
    const payload = { user: { id: user.id } };

    // Sign the JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and user data
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        posts: user.posts,
        followers: user.followers,
        following: user.following
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials due to user email' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials due to password' });
    }

    // Proceed with JWT token creation if passwords match
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        posts: user.posts,
        followers: user.followers,
        following: user.following,
      }
    });
  } catch (err) {
    console.error("error in login ", err.message);
    res.status(500).send('Server error');
  }
});

// Upload profile picture (File upload via Cloudinary)
router.post('/uploadProfilePic', fileUpload(), async (req, res) => {
  try {
    const { file } = req.files; // Using `req.files` to access the uploaded file
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'profile_pics', // Optional: Organize images into folders
      public_id: `profile_${Date.now()}`, // Optional: Set a unique name
      resource_type: 'auto', // Automatically detect file type (image, video, etc.)
    });

    const imageUrl = result.secure_url; // Cloudinary URL

    // You can now save the URL to the user profile
    const user = await User.findByIdAndUpdate(
      req.body.userId, 
      { profilePic: imageUrl },
      { new: true }
    );

    res.json({
      msg: 'Profile picture uploaded successfully',
      profilePic: imageUrl,
      user
    });

  } catch (err) {
    console.error('Error uploading profile pic:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update profile details: username, about, profilePic
router.put('/updateProfilePic', async (req, res) => {
  try {
    console.log('PUT /updateProfilePic hit'); // Debug log

    const { userId, username, about, profilePic } = req.body;

    if (profilePic) {
      // Cloudinary upload process
      const result = await cloudinary.uploader.upload(profilePic, {
        folder: 'profile_pics', // Optionally organize images in a folder
        public_id: `profile_${Date.now()}`, // Unique name for each upload
        resource_type: 'auto', // Detect file type automatically
      });

      // Get the URL of the uploaded image
      const imageUrl = result.secure_url;

      // Update user profile with the new image URL
      const user = await User.findByIdAndUpdate(
        userId,
        {
          ...(username && { username }),
          ...(about && { about }),
          ...(imageUrl && { profilePic: imageUrl }), // Use the image URL here
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      console.log('User profile updated successfully'); // Debug log

      res.json({
        msg: 'User profile updated successfully',
        user,
      });
    } else {
      return res.status(400).json({ msg: 'Profile picture is required' });
    }
  } catch (error) {
    console.error('Error in PUT /updateProfilePic:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
