const express = require('express');

const router = express.Router();

// Mock user data for testing
let users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

// Get all users
router.get('/', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
});

// Get user by ID
router.get('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
    });
  }
});

// Create new user
router.post('/', (req, res) => {
  try {
    const { name, email, role = 'user' } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required',
      });
    }

    // Check if email already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
      });
    }

    const newUser = {
      id: users.length + 1,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
    });
  }
});

// Update user
router.put('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, role } = req.body;

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if email already exists for other users
    if (email && email !== users[userIndex].email) {
      const existingUser = users.find((u) => u.email === email && u.id !== userId);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists',
        });
      }
    }

    users[userIndex] = {
      ...users[userIndex],
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      updatedAt: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      data: users[userIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
    });
  }
});

// Delete user
router.delete('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    res.status(200).json({
      success: true,
      data: deletedUser,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
    });
  }
});

module.exports = router; 