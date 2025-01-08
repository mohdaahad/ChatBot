import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Secret key for JWT (use environment variables for security)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function POST(req: Request) {
  try {
    await dbConnect(); 
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        fullname:user.fullname,
        phone:user.phone
      },
      JWT_SECRET,
      { expiresIn: '1h' } 
    );

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error handling login request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
