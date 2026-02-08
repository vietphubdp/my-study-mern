import mongoose from 'mongoose';

export const connectDb = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI');
  }

  await mongoose.connect(uri, {
    autoIndex: true,
  });

  console.log('✅ MongoDB connected');
};
