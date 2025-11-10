import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Get unique skills using aggregation
    const result = await User.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills' } },
      { $sort: { _id: 1 } },
    ]);

    const skills = result.map((doc) => doc._id).filter((skill) => skill);

    return NextResponse.json({
      success: true,
      skills,
      total: skills.length,
    });
  } catch (error: any) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch skills',
        skills: [],
      },
      { status: 500 }
    );
  }
}
