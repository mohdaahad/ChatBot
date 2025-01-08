import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact';

export async function POST(req: Request) {
  try {
    await dbConnect(); 
    const { email, phone, useCase, turnover, companyName, country, fullName } = await req.json();
    if (!email || !phone || !useCase) {
      return NextResponse.json(
        { success: false, message: 'Email, phone, and useCase are required fields.' },
        { status: 400 }
      );
    }

    const newContact = new Contact({
      email,
      phone,
      useCase,
      turnover,
      companyName,
      fullName,
      country,
    });
    await newContact.save();

    return NextResponse.json({ success: true, data: newContact });
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  try {
    const contacts = await Contact.find(); 
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching contacts' },
      { status: 500 }
    );
  }
}
