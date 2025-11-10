import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Get unique work types using aggregation
    const result = await User.aggregate([
      { $unwind: '$work' },
      { $group: { _id: '$work' } },
      { $sort: { _id: 1 } },
    ]);

    const workTypes = result.map((doc) => doc._id).filter((work) => work);

    return NextResponse.json({
      success: true,
      skills: workTypes, // Keep 'skills' key for backward compatibility
      work: workTypes,
      total: workTypes.length,
    });
  } catch (error: any) {
    console.error('Error fetching work types:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch work types',
        skills: [],
        work: [],
      },
      { status: 500 }
    );
  }
}
