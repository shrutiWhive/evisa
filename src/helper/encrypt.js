const ENCRYPTION_KEY = 'your-secret-password'; // Replace with a strong secret, ideally from .env

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function getKey() {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(ENCRYPTION_KEY),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('unique-salt'), // Use a unique salt
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(text) {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes IV for AES-GCM
  const encodedText = encoder.encode(text);

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedText
  );

  // base64 encode IV and ciphertext, joined by a dot
  const ivBase64 = btoa(String.fromCharCode(...iv));
  const ctBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));

  return `${ivBase64}.${ctBase64}`;
}

export async function decrypt(data) {
  const [ivBase64, ctBase64] = data.split('.');
  if (!ivBase64 || !ctBase64) throw new Error('Invalid encrypted data format');

  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(atob(ctBase64), c => c.charCodeAt(0));

  const key = await getKey();

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    ciphertext
  );

  return decoder.decode(decryptedBuffer);
}
