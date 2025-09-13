const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Obtener usuarios conectados
router.get('/online', auth, async (req, res) => {
  try {
    const onlineUsers = await User.find({ 
      isOnline: true,
      _id: { $ne: req.userId } // Excluir al usuario actual
    }).select('name email isOnline lastSeen avatar createdAt');

    res.json({
      success: true,
      users: onlineUsers
    });
  } catch (error) {
    console.error('Error obteniendo usuarios online:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener todos los usuarios (para búsqueda)
router.get('/all', auth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { _id: { $ne: req.userId } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('name email isOnline lastSeen avatar createdAt')
      .limit(50);

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener perfil de usuario
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      success: true,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
