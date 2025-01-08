import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, phone, fullName } = await req.json(); 
    console.log(email, phone, fullName)

    if (!email || !phone || !fullName) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }


    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 404 }
      );
    }

    // Create a new user
    const newUser = new User({ email, phone, fullname:fullName });
    await newUser.save(); // Save the user to the database

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        fullname:newUser.fullname,
        phone:newUser.phone
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expiry time (e.g., 1 hour)
    );

    // Return a successful response with the token
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      token, // Include the token in the response
    });
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
