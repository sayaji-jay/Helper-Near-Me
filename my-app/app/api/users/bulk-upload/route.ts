import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Papa from 'papaparse';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file uploaded',
        },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();

    // Parse CSV
    const parseResult = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error parsing CSV file',
        },
        { status: 400 }
      );
    }

    const usersData = parseResult.data as any[];
    let insertedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let idx = 0; idx < usersData.length; idx++) {
      const userData = usersData[idx];
      const rowNum = idx + 2; // +2 because 1 is header and arrays are 0-indexed

      try {
        // Clean up data
        const cleanedData: any = {};
        for (const key in userData) {
          const value = userData[key];
          cleanedData[key] = value === null || value === undefined || value === 'NaN' || value === '' ? '' : String(value).trim();
        }

        // Convert work from string to array
        if (cleanedData.work && typeof cleanedData.work === 'string') {
          cleanedData.work = cleanedData.work.split(',').map((s: string) => s.trim()).filter((s: string) => s);
        }

        // Validate required fields - only name, phone, and work are required
        if (!cleanedData.name || !cleanedData.name.trim()) {
          errors.push(`Row ${rowNum}: Name is required`);
          errorCount++;
          continue;
        }

        if (!cleanedData.phone || !cleanedData.phone.trim()) {
          errors.push(`Row ${rowNum}: Phone is required`);
          errorCount++;
          continue;
        }

        if (!cleanedData.work || (Array.isArray(cleanedData.work) && cleanedData.work.length === 0)) {
          errors.push(`Row ${rowNum}: Work type is required`);
          errorCount++;
          continue;
        }

        // Validate email format if provided
        if (cleanedData.email && cleanedData.email.trim() && !cleanedData.email.includes('@')) {
          errors.push(`Row ${rowNum}: Invalid email format`);
          errorCount++;
          continue;
        }

        // Check if email already exists (only if email is provided)
        if (cleanedData.email && cleanedData.email.trim()) {
          const existingUser = await User.findOne({ email: cleanedData.email.toLowerCase() });
          if (existingUser) {
            errors.push(`Row ${rowNum}: Email ${cleanedData.email} already exists`);
            errorCount++;
            continue;
          }
        }

        // Create user with new fields
        await User.create({
          name: cleanedData.name,
          email: cleanedData.email ? cleanedData.email.toLowerCase() : '',
          phone: cleanedData.phone,
          gender: cleanedData.gender || '',
          work: cleanedData.work,
          address: cleanedData.address || '',
          village: cleanedData.village || '',
          city: cleanedData.city || '',
          state: cleanedData.state || '',
          companyName: cleanedData.companyName || '',
          experience: cleanedData.experience || '',
          description: cleanedData.description || '',
          avatar: cleanedData.avatar || undefined,
        });

        insertedCount++;
      } catch (error: any) {
        errors.push(`Row ${rowNum}: ${error.message}`);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Bulk upload completed. Inserted: ${insertedCount}, Errors: ${errorCount}`,
      count: insertedCount,
      inserted: insertedCount,
      errors: errorCount,
      error_details: errors,
    });
  } catch (error: any) {
    console.error('Error in bulk upload:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process bulk upload',
      },
      { status: 500 }
    );
  }
}
