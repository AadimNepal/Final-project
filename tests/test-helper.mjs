import { User } from '../models/user.mjs';
import bcrypt from 'bcrypt';

export async function setupTestData() {
  // Clear existing test data
  await User.deleteMany({ email: /test@/ });

  // Create a test doctor
  const hashedPassword = await bcrypt.hash('password123', 10);
  await User.create({
    name: 'Test Doctor',
    email: 'test@nyu.edu',
    password: hashedPassword,
    isDoctor: true,
    isVerified: true
  });
}

export async function cleanupTestData() {
  await User.deleteMany({ email: /test@/ });
}