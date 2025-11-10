import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/users - Get all users with search and filter
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const workParam = searchParams.get('work') || searchParams.get('skills') || ''; // Support both for backward compatibility
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Build query
    const query: any = {};

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { village: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { work: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Add work filter - support multiple work types
    if (workParam && workParam !== 'all') {
      const workList = workParam.split(',').map((s) => s.trim()).filter((s) => s);

      if (workList.length > 0) {
        const workConditions = workList.map((workType) => ({
          work: { $regex: workType, $options: 'i' },
        }));

        // Merge with existing query
        if (query.$or) {
          query.$and = [
            { $or: query.$or }, // Search conditions
            { $or: workConditions }, // Work conditions
          ];
          delete query.$or;
        } else {
          query.$or = workConditions;
        }
      }
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Get users with pagination
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    // Serialize users
    const serializedUsers = users.map((user: any) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      work: user.work,
      address: user.address,
      village: user.village,
      city: user.city,
      state: user.state,
      companyName: user.companyName,
      description: user.description,
      experience: user.experience,
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(/\s+/g, '+')}&background=667eea&color=fff&size=200`,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      users: serializedUsers,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch users',
        users: [],
      },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const data = await request.json();

    // Validate required fields - only name, phone, and work are required
    if (!data.name || !data.name.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name is required',
        },
        { status: 400 }
      );
    }

    if (!data.phone || !data.phone.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Phone is required',
        },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (data.email && data.email.trim() && !data.email.includes('@')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    // Validate work is an array
    if (!Array.isArray(data.work) || data.work.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Work must be a non-empty array',
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists',
        },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      gender: data.gender.trim(),
      work: data.work,
      address: data.address.trim(),
      village: data.village.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      companyName: data.companyName?.trim() || '',
      description: data.description?.trim() || '',
      experience: data.experience.trim(),
      avatar: data.avatar || undefined,
    });

    // Serialize user (cast to any to avoid TypeScript _id issue)
    const serializedUser = {
      id: (user._id as any).toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      work: user.work,
      address: user.address,
      village: user.village,
      city: user.city,
      state: user.state,
      companyName: user.companyName,
      description: user.description,
      experience: user.experience,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: serializedUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create user',
      },
      { status: 500 }
    );
  }
}
