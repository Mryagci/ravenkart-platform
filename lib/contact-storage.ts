// Shared in-memory storage for contact information
// This will be replaced with database storage later

interface ContactInfo {
  emails?: {
    support: string;
    sales: string;
    general: string;
  };
  phones?: {
    support: string;
    sales: string;
  };
  address?: {
    street: string;
    district: string;
    postal: string;
    country: string;
  };
  social?: {
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  hours?: {
    weekdays: string;
    weekend: string;
  };
}

// Default contact information
const defaultContactInfo: ContactInfo = {
  emails: {
    support: 'ravenkart.tr@gmail.com',
    sales: 'ravenkart.tr@gmail.com', 
    general: 'ravenkart.tr@gmail.com'
  },
  phones: {
    support: '+90 530 9588531',
    sales: '+90 530 9588531'
  },
  address: {
    street: '',
    district: 'Ankara',
    postal: '',
    country: 'Türkiye'
  },
  social: {
    twitter: '@ravenkart',
    linkedin: 'company/ravenkart', 
    instagram: '@ravenkart'
  },
  hours: {
    weekdays: '09:00 - 18:00',
    weekend: 'Kapalı'
  }
};

// Shared storage
let contactStorage: ContactInfo = { ...defaultContactInfo };

export const ContactStorage = {
  get: (): ContactInfo => {
    return { ...contactStorage };
  },
  
  set: (newContactInfo: Partial<ContactInfo>): ContactInfo => {
    contactStorage = {
      ...contactStorage,
      ...newContactInfo
    };
    return { ...contactStorage };
  },
  
  update: (key: keyof ContactInfo, value: any): ContactInfo => {
    contactStorage = {
      ...contactStorage,
      [key]: value
    };
    return { ...contactStorage };
  },
  
  reset: (): ContactInfo => {
    contactStorage = { ...defaultContactInfo };
    return { ...contactStorage };
  }
};