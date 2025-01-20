export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'company' | 'agency' | 'staff';
  specificType: string;
  positionCategory?: string;
}

export interface Shift {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location: string;
  companyId: string;
  staffId?: string;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
}

export interface Company {
  id: string;
  name: string;
  type: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export interface Agency {
  id: string;
  name: string;
  type: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  positionCategory: string;
  skills: string[];
  availability: {
    [key: string]: { start: string; end: string }[];
  };
}

