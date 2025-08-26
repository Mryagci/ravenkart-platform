'use client';

import { useState, useEffect } from 'react';

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

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/contact', {
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      } else {
        throw new Error('Failed to fetch contact information');
      }
    } catch (err) {
      console.error('Error fetching contact info:', err);
      setError('Contact information could not be loaded');
      
      // Fallback to default values
      setContactInfo({
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
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  return {
    contactInfo,
    loading,
    error,
    refetch: fetchContactInfo
  };
};