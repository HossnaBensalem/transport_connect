import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      phone
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log('🔐 Login attempt for email:', req.body.email); // Debug log
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // البحث عن المستخدم مع كلمة المرور
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found for email:', email); // Debug log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User found:', user.firstName, user.lastName, '| Role:', user.role); // Debug log
    console.log('🔍 User active status:', user.isActive); // Debug log

    // التحقق من حالة المستخدم
    if (!user.isActive) {
      console.log('❌ User account is inactive'); // Debug log
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // التحقق من كلمة المرور - استخدام matchPassword بدلاً من comparePassword
    const isMatch = await user.matchPassword(password);
    console.log('🔐 Password match result:', isMatch); // Debug log
    
    if (!isMatch) {
      console.log('❌ Password does not match'); // Debug log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Login successful for user:', user.email); // Debug log

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error); // Debug log
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isVerified: user.isVerified,
        rating: user.rating,
        completedTransports: user.completedTransports,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};