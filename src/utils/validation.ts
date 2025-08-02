// Email validation helper
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number formatting helper
export const formatPhoneNumber = (text: string): string => {
  // Remove all non-numeric characters
  const cleaned = text.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
};

// Clean phone number (remove formatting)
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

// Validate phone number length
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = cleanPhoneNumber(phone);
  return cleaned.length === 10;
};

// Name validation (at least 2 characters)
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};