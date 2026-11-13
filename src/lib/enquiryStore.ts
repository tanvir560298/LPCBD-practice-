export interface EnquiryRecord {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  courseSlug: string;
  branchId: string;
  message?: string;
  receivedAt: string;
}

// In-memory store for synthetic demonstration
export const receivedEnquiries: EnquiryRecord[] = [];

