import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create CSV template
    const csvContent = `name,email,phone,location,skills,description,experience,avatar
John Doe,john.doe@example.com,+91 98765 43210,"Mumbai, Maharashtra","Python, Django, Backend",Full Stack Developer with 5+ years experience,5 years,`;

    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="users_template.csv"',
      },
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to download template',
      },
      { status: 500 }
    );
  }
}
