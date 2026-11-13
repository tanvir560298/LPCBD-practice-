import { describe, it, expect } from 'vitest';
import { POST, GET } from '@/app/api/enquiry/route';
import { receivedEnquiries } from '@/lib/enquiryStore';
import { NextRequest } from 'next/server';

function createMockRequest(body: any): NextRequest {
  return new NextRequest('http://localhost:3000/api/enquiry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

describe('/api/enquiry Admission Workflow', () => {
  it('should reject request missing mandatory fields with 400 Bad Request', async () => {
    const req = createMockRequest({
      fullName: '',
      phone: '',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.errors.fullName).toBeDefined();
    expect(json.errors.phone).toBeDefined();
  });

  it('should reject invalid email format with field-specific error', async () => {
    const req = createMockRequest({
      fullName: 'Tanzim Ahmed',
      phone: '01711000000',
      email: 'invalid-email-address',
      courseSlug: 'spoken-english',
      branchId: 'br-dhaka',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.errors.email).toBe('Please provide a valid email address format.');
  });

  it('should accept valid admission enquiry and return 201 Created with tracking code', async () => {
    const req = createMockRequest({
      fullName: 'Tanzim Ahmed',
      phone: '01711-223344',
      email: 'tanzim.ahmed@example.com',
      courseSlug: 'ielts-preparation',
      branchId: 'br-dhaka',
      message: 'Interested in evening weekend schedule',
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.referenceCode).toBeDefined();
    expect(json.referenceCode.startsWith('ENQ-')).toBe(true);
    expect(json.data.fullName).toBe('Tanzim Ahmed');
  });

  it('should allow admissions staff to retrieve received enquiries via GET', async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.total).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(json.enquiries)).toBe(true);
  });
});
