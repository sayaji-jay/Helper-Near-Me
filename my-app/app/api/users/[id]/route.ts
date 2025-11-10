import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    const serializedUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      skills: user.skills,
      description: user.description,
      experience: user.experience,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({
      success: true,
      user: serializedUser,
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch user',
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // If email is being updated, check if it's already in use
    if (data.email && data.email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: data.email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'Email already in use',
          },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (data.name) updateData.name = data.name.trim();
    if (data.email) updateData.email = data.email.trim().toLowerCase();
    if (data.phone) updateData.phone = data.phone.trim();
    if (data.location) updateData.location = data.location.trim();
    if (data.skills) updateData.skills = data.skills;
    if (data.description) updateData.description = data.description.trim();
    if (data.experience) updateData.experience = data.experience.trim();
    if (data.avatar) updateData.avatar = data.avatar;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    const serializedUser = {
      id: updatedUser!._id.toString(),
      name: updatedUser!.name,
      email: updatedUser!.email,
      phone: updatedUser!.phone,
      location: updatedUser!.location,
      skills: updatedUser!.skills,
      description: updatedUser!.description,
      experience: updatedUser!.experience,
      avatar: updatedUser!.avatar,
      createdAt: updatedUser!.createdAt,
      updatedAt: updatedUser!.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: serializedUser,
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update user',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete user',
      },
      { status: 500 }
    );
  }
}
