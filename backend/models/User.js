import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false  // اختياري، لحماية كلمة المرور عند الجلب
  },
  role: {
    type: String,
    enum: ['driver', 'sender', 'admin'],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: String,
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  completedTransports: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// تشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  // إذا كانت كلمة المرور مشفرة مسبقًا، تخطى التشفير
  if (this.password && this.password.startsWith('$2a$')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// مقارنة كلمة المرور
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
