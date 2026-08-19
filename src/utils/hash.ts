export async function generateFileHash(file: File): Promise<string> {
  try {
    // Ensure we are running client-side where crypto is available
    if (typeof window === 'undefined' || !window.crypto?.subtle) {
      throw new Error('Cryptographic hashing is only available in the browser.');
    }

    const buffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('File hashing failed:', error);
    throw new Error('Could not verify file integrity.');
  }
}
