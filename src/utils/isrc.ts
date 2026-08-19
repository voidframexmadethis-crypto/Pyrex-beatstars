/**
 * ISRC Code Generator Utility
 * Format: US-PRX-26-XXXXX
 * US: Country Code
 * PRX: Registrant Code (Pyrex spinna)
 * 26: Year (2026)
 * XXXXX: Unique Designation
 */

export const generateISRC = (trackId: string): string => {
  // Use a simple hash or random string for the designation part
  // In a real scenario, this would be a sequence from a database
  const designation = trackId.slice(-5).toUpperCase().padEnd(5, '0');
  const year = '26'; // 2026
  return `US-PRX-${year}-${designation}`;
};

export const isValidISRC = (code: string): boolean => {
  const isrcRegex = /^[A-Z]{2}-[A-Z0-9]{3}-[0-9]{2}-[0-9]{5}$/;
  return isrcRegex.test(code);
};
