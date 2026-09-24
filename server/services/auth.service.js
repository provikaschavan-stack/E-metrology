const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const { signToken } = require('../utils/jwt.utils');
const { ALLOWED_ROLES } = require('../middleware/rbac');

async function register({ name, email, password, role, phone }) {
  if (!name || !email || !password || !role) {
    throw { status: 400, message: 'Name, email, password, and role are required' };
  }

  const normalizedRole = role.toUpperCase();
  if (!ALLOWED_ROLES.includes(normalizedRole)) {
    throw { 
      status: 400, 
      message: `Invalid role '${role}'. Allowed roles are: ${ALLOWED_ROLES.join(', ')}` 
    };
  }

  if (normalizedRole !== 'BUSINESS') {
    throw {
      status: 403,
      message: 'Public registration is limited to BUSINESS accounts. Staff accounts must be provisioned by an administrator.'
    };
  }

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw { status: 409, message: 'A user with this email address already exists' };
  }

  const password_hash = await bcrypt.hash(password, 10);
  const newUser = await userModel.create({
    name,
    email: email.toLowerCase().trim(),
    password_hash,
    role: normalizedRole,
    phone: phone || null
  });

  const token = signToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name
  });

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      created_at: newUser.created_at
    },
    token
  };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw { status: 400, message: 'Email and password are required' };
  }

  const user = await userModel.findByEmail(email.toLowerCase().trim());
  if (!user) {
    throw { status: 401, message: 'Invalid email or password' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw { status: 401, message: 'Invalid email or password' };
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      created_at: user.created_at
    },
    token
  };
}

async function getMe(userId) {
  const user = await userModel.findById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }
  return user;
}

module.exports = {
  register,
  login,
  getMe
};
