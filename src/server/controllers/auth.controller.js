const authService = require('../services/auth.service');

async function register(req, res) {
  try {
    const { name, email, password, role, phone } = req.body;
    const result = await authService.register({ name, email, password, role, phone });
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error during registration'
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error during login'
    });
  }
}

async function getMe(req, res) {
  try {
    const user = await authService.getMe(req.user.id);
    return res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Failed to fetch current user profile'
    });
  }
}

module.exports = {
  register,
  login,
  getMe
};
