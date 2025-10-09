// function generateRandomId(length = 4) {
//     const charset = '012389abcdefghijklmnopqvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@&%#';
//     let result = '';
//     for (let i = 0; i < length; i++) {
//       result += charset[Math.floor(Math.random() * charset.length)];
//     }
//     return result;
//   }
  
  


const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
const base = charset.length;

/**
 * Encode a number into a unique 5-character string with no repeated characters.
 */
export const encodeId = (num) => {
  let encoded = '';

  // Encode numeric ID to baseN
  let n = num;
  while (n > 0) {
    const index = n % base;
    encoded = charset[index] + encoded;
    n = Math.floor(n / base);
  }

  // Add deterministic salt based on ID (not random)
  const salt1 = charset[(num * 13 + 31) % base];
  const salt2 = charset[(num * 17 + 73) % base];

  // Merge salt to front/back
  encoded = salt1 + encoded + salt2;

  // Ensure exactly 5 characters, trimmed or padded with charset-based shuffle
  while (encoded.length < 5) {
    const filler = charset[(num * encoded.length + 19) % base];
    if (!encoded.includes(filler)) {
      encoded = filler + encoded;
    } else {
      encoded += filler;
    }
  }

  return encoded.slice(0, 5);
};


export const decodeId = (str) => {
  if (typeof str !== 'string' || str.length !== 5) {
    throw new Error("Encoded string must be exactly 5 characters");
  }

  // Remove salt chars at front and back
  const core = str.slice(1, 4); // 3 chars in the middle

  // Decode baseN number from core
  let decoded = 0;
  for (let i = 0; i < core.length; i++) {
    const index = charset.indexOf(core[i]);
    if (index === -1) throw new Error(`Invalid character: ${core[i]}`);
    decoded = decoded * base + index;
  }

  return decoded;
};