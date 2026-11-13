import { NextRequest, NextResponse } from 'next/server';
import { receivedEnquiries } from '@/lib/enquiryStore';

interface EnquiryPayload {
  fullName: string;
  phone: string;
  email?: string;
  courseSlug: string;
  branchId: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, email, courseSlug, branchId, message } = body as Partial<EnquiryPayload>;

    // 1. Server-side validation
    const errors: Record<string, string> = {};

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 9) {
      errors.phone = 'A valid contact phone number (at least 9 digits) is required.';
    } else {
      const cleanPhone = phone.replace(/[\s-]/g, '');
      if (!/^(\+?880|0)?1[3-9]\d{8}$/.test(cleanPhone) && cleanPhone.length < 9) {
        errors.phone = 'Please provide a valid Bangladeshi phone number.';
      }
    }

    if (email && typeof email === 'string' && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Please provide a valid email address format.';
      }
    }

    if (!courseSlug || typeof courseSlug !== 'string') {
      errors.courseSlug = 'Target course must be selected.';
    }

    if (!branchId || typeof branchId !== 'string') {
      errors.branchId = 'Preferred campus branch must be selected.';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed. Please review your input.',
          errors,
        },
        { status: 400 }
      );
    }

    // 2. Persist synthetic enquiry with tracking reference
    const referenceCode = `ENQ-${Date.now().toString().slice(-6)}`;
    const newEnquiry = {
      id: referenceCode,
      fullName: fullName!.trim(),
      phone: phone!.trim(),
      email: email ? email.trim() : undefined,
      courseSlug: courseSlug!,
      branchId: branchId!,
      message: message ? message.trim() : '',
      receivedAt: new Date().toISOString(),
    };

    receivedEnquiries.push(newEnquiry);

    // Return real confirmation with reference
    return NextResponse.json(
      {
        success: true,
        referenceCode,
        message: 'Admission enquiry received successfully. An LPC academic advisor will contact you.',
        data: {
          referenceCode,
          fullName: newEnquiry.fullName,
          branchId: newEnquiry.branchId,
          receivedAt: newEnquiry.receivedAt,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Malformed request payload. Expected JSON.',
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    total: receivedEnquiries.length,
    enquiries: receivedEnquiries,
  });
}
