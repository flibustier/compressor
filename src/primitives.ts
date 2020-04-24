const BASE64_URL_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const MAX_SUPPORTED_BITS_PER_NUMBER = 32;

export const BITS_PER_BASE64_SYMBOL = 6;
export const DISAMBIGUATION_FLAG = "=";

type uint6 = number;

// 42 => 6 (bits needed: 101010)
export const bitsNeeded = (number: number) => {
  if (number === 0) return 1;

  let i = 0;
  while (i < MAX_SUPPORTED_BITS_PER_NUMBER && number >>> i !== 1) i++;

  return i + 1;
};

// 42 => 'q'
export const toBase64 = (uint6: uint6) => BASE64_URL_ALPHABET[uint6 % 64];

// 'q' => 42
export const fromBase64 = (symbol: string) =>
  BASE64_URL_ALPHABET.indexOf(symbol);

// In 6 bits, 42 => ['1', '0', '1', '0', '1', '0']
export const toBinaryEncodedIn = (encodingBitSize: number) => (
  numberToConvert: number
) =>
  numberToConvert
    .toString(2)
    .slice(-encodingBitSize)
    .padStart(encodingBitSize, "0")
    .split("");

// ['1', '0', '1', '0', '1', '0'] => 42
export const toUInt6 = (binaryArray: string[]): uint6 => {
  const binaryString = binaryArray.join("").padEnd(BITS_PER_BASE64_SYMBOL, "0");

  return parseInt(binaryString, 2);
};

export const last = (array: any[]) => array[array.length - 1];

export function chunks(array: string[], chunkSize: number): string[][] {
  const output = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    output.push(array.slice(i, i + chunkSize));
  }
  return output;
}
