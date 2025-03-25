import CryptoJS from 'crypto-js';

const secret_key =
  localStorage.getItem('_TFDSFUMATRIX') ?? 'HVkaW9uZXBhbC5jb20iL';

/**
 * Encrypts a given string using AES encryption.
 * @param data The data to encrypt.
 * @returns Encrypted string.
 */
export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, secret_key).toString();
};

/**
 * Decrypts an AES-encrypted string.
 * @param ciphertext The encrypted string.
 * @returns Decrypted data or null if decryption fails.
 */
export const decryptData = (ciphertext: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret_key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
