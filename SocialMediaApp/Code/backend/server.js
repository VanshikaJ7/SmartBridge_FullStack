const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const storyRoutes = require('./routes/story');
const postRoutes = require('./routes/post');
const User = require('./models/user');
const Story = require('./models/Story');
const Post = require('./models/Post');
const Chats = require('./models/chat');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Connect to DB
connectDB().catch(err => console.error('Failed to connect to MongoDB', err));

// Middleware
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/story', storyRoutes);

// Utility functions
const findUserByUserId = async (id) => {
  try {
    return await User.findOne({ _id: id });
  } catch {
    throw new Error('Error finding user');
  }
};

const findUserByUsername = async (username) => {
  try {
    return await User.findOne({ username });
  } catch {
    throw new Error('Error finding user');
  }
};

// Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('create-new-story', async (data) => {
    try {
      const storyData = new Story(data);
      await storyData.save();
      socket.emit('story-created');
    } catch (error) {
      console.error(error.message);
    }
  });

  socket.on('user-search', async (data) => {
    try {
      const user = await findUserByUsername(data.username);
      socket.emit('searched-user', { user });
    } catch (error) {
      console.error('Error during search:', error);
    }
  });

  socket.on('fetch-profile', async ({ _id }) => {
    try {
      const user = await findUserByUserId(_id);
      socket.emit('profile-fetched', { profile: user });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  });

  socket.on('postLiked', async ({ userId, postId }) => {
    try {
      const post = await Post.findById(postId);
      post.likes.push(userId);
      await post.save();
      io.emit('likeUpdated', { postId, likes: post.likes });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  });

  socket.on('postUnLiked', async ({ userId, postId }) => {
    try {
      const post = await Post.findById(postId);
      post.likes = post.likes.filter(id => id !== userId);
      await post.save();
      io.emit('likeUpdated', { postId, likes: post.likes });
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  });

  socket.on('followUser', async ({ ownId, followingUserId }) => {
    try {
      const user = await User.findById(ownId);
      user.following.push(followingUserId);
      await user.save();

      const followedUser = await User.findById(followingUserId);
      followedUser.followers.push(ownId);
      await followedUser.save();

      socket.emit('userFollowed', { following: user.following });
    } catch (error) {
      console.error('Error following user:', error);
    }
  });

  socket.on('unFollowUser', async ({ ownId, followingUserId }) => {
    try {
      const user = await User.findById(ownId);
      user.following = user.following.filter(id => id !== followingUserId);
      await user.save();

      const followedUser = await User.findById(followingUserId);
      followedUser.followers = followedUser.followers.filter(id => id !== ownId);
      await followedUser.save();

      socket.emit('userFollowed', { following: user.following });
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  });

  socket.on('makeComment', async ({ postId, username, comment }) => {
    try {
      const post = await Post.findById(postId);
      post.comments.push({ username, comment });
      await post.save();
      io.emit('commentAdded', { postId, comments: post.comments });
    } catch (error) {
      console.error('Error making comment:', error);
    }
  });

  socket.on('delete-post', async ({ postId }) => {
    try {
      await Post.findByIdAndDelete(postId);
      io.emit('postDeleted', { postId });
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  });

  socket.on('updateProfile', async ({ userId, profilePic, username, about }) => {
    try {
      const user = await User.findById(userId);
      if (user) {
        user.profilePic = profilePic || user.profilePic;
        user.username = username || user.username;
        user.about = about || user.about;
        await user.save();
        socket.emit('profileUpdated', { userId: user._id, profilePic: user.profilePic, username: user.username, about: user.about });
      } else {
        socket.emit('error', { message: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      socket.emit('error', { message: 'Error updating profile' });
    }
  });

  socket.on('fetch-friends', async ({ userId }) => {
    try {
      const userData = await User.findOne({ _id: userId });
      if (userData) {
        const friendsList = userData.following.filter(id => userData.followers.includes(id));
        const friendsData = await User.find({ _id: { $in: friendsList } }, { _id: 1, username: 1, profilePic: 1 }).exec();
        socket.emit('friends-data-fetched', { friendsData });
      } else {
        socket.emit('friends-data-fetched', { friendsData: [] });
      }
    } catch (error) {
      console.error('Error fetching friends data:', error);
    }
  });

  socket.on('fetch-messages', async ({ chatId }) => {
    try {
      const chat = await Chats.findOne({ _id: chatId }).exec();
      socket.emit('messages-updated', { chat: chat || null });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  });

  socket.on('update-messages', async ({ chatId }) => {
    try {
      const chat = await Chats.findOne({ _id: chatId }).exec();
      socket.emit('messages-updated', { chat: chat || null });
    } catch (error) {
      console.error('Error updating messages:', error);
    }
  });

  socket.on('new-message', async ({ chatId, id, text, file, senderId, date }) => {
    try {
      const chat = await Chats.findOneAndUpdate(
        { _id: chatId },
        { $addToSet: { messages: { id, text, file, senderId, date } } },
        { new: true, upsert: true }
      );

      if (chat) {
        socket.emit('messages-updated', { chat });
        socket.broadcast.to(chatId).emit('message-from-user', { message: { id, text, file, senderId, date, chatId } });
      }
    } catch (error) {
      console.error('Error adding new message:', error);
    }
  });

  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Catch-all error handler
// Root route for sanity check
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('Unexpected server error:', err.stack);
  res.status(500).send('Something broke!');
});

// Server listen
const PORT = process.env.PORT || 6001;
server.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));

const path = require('path');

// Serve React frontend from build folder
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

