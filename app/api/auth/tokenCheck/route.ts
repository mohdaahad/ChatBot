import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Secret key for JWT (use environment variables for security)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required.' },
        { status: 400 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({
      success: true,
      message: 'Token is valid.',
      data: decoded,
    });
  } catch (error) {
    console.error('Error verifying token:', error);

    // Token verification error
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { success: false, message: 'Invalid token.' },
        { status: 401 }
      );
    }

    // Other errors
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
