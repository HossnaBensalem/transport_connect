import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

async function createAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MongoDB URI is not defined in .env file!');
      process.exit(1);
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // حذف أي Admin موجود
    await User.deleteMany({ role: 'admin' });
    console.log('🗑️  Deleted existing admin users');

    // إنشاء Admin جديد بكلمة مرور نصية فقط (سيشفرها الـ pre-save)
    const admin = new User({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@transportconnect.com',
      password: 'admin123456',
      phone: '+212600000000',
      role: 'admin',
      isVerified: true,
      isActive: true,
      rating: { average: 0, count: 0 }
    });

    await admin.save();
    console.log('🎉 Admin user created successfully!');

    // اختبار كلمة المرور
    const foundAdmin = await User.findOne({ email: 'admin@transportconnect.com' }).select('+password');
    const passwordMatches = await foundAdmin.matchPassword('admin123456');

    console.log('🧪 Password verification test:', passwordMatches ? 'PASSED' : 'FAILED');

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
