const BASE64_URL_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const MAX_SUPPORTED_BITS_PER_NUMBER = 32;

export const BASE64_BITS_PER_SYMBOL = 6;
export const ZERO_ENDING_COMPLETION_FLAG = "=";

// '1' => '0'
export const invertBitString = bit => (bit == "1" ? "0" : "1");

// 42 => 6 (bits needed: 101010)
export const bitsNeeded = number => {
  if (number === 0) return 1;

  let i = 0;
  while (i < MAX_SUPPORTED_BITS_PER_NUMBER && number >>> i !== 1) i++;

  return i + 1;
};

// 42 => 'q'
export const toBase64 = uint6 => BASE64_URL_ALPHABET[uint6 % 64];

// 'q' => 42
export const fromBase64 = symbol => BASE64_URL_ALPHABET.indexOf(symbol);

// ['1', '0', '1', '0', '1', '0'] => 42
export const toUInt6 = binaryArray => {
  const binaryString = binaryArray.join("").padEnd(BASE64_BITS_PER_SYMBOL, 0);

  return parseInt(binaryString, 2);
};

// In 6 bits, 42 => '101010', 2 => '000010'
export const toBinaryEncodedIn = numberOfBits => numberToConvert =>
  numberToConvert
    .toString(2)
    .slice(-numberOfBits)
    .padStart(numberOfBits, 0);

// ['101010', '0110…', …] => ['1', '0', '1', …]
export const toFlatBinaryArray = binaryStrings =>
  binaryStrings.flatMap(binaryStr => binaryStr.split(""));
