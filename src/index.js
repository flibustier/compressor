import { chunk } from "lodash";

const BASE64_URL_DEFINITION =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
const MAX_SUPPORTED_BITS = 64;
const BASE64_BITS_PER_SYMBOL = 6;

// 42 => 'q'
export const toBase64 = uint6 => BASE64_URL_DEFINITION[uint6 % 64];

// ['1', '0', '1', '0', '1', '0'] => 42
export const toUInt6 = binaryArray => {
  const binaryString = binaryArray.join("").padEnd(BASE64_BITS_PER_SYMBOL, 0);

  return parseInt(binaryString, 2);
};

// 42 => 6 (bits needed: 101010)
export const bitsNeeded = number => {
  let i = 1;
  while (i < MAX_SUPPORTED_BITS && number >> i > 0) i++;

  return i % MAX_SUPPORTED_BITS;
};

// In 6 bits, 42 => '101010', 2 => '000010'
export const toBinaryEncodedIn = numberOfBits => numberToConvert =>
  numberToConvert
    .toString(2)
    .slice(-numberOfBits)
    .padStart(numberOfBits, 0);

// [4, 1, 6, 0, 1, 3] => 'ChwL'
export const encode = numbers => {
  const bigestNumber = Math.max(...numbers);

  const encodingLength = bitsNeeded(bigestNumber);

  const binaryStrings = numbers.map(toBinaryEncodedIn(encodingLength)); // ['00101010', '00000100', …]

  const binaryArray = binaryStrings.join("").split(""); // ['1', '0', '1', '1', …]

  const chunkedIn6bits = chunk(binaryArray, BASE64_BITS_PER_SYMBOL); // [['1' , '0', …], ['1', '1', …], …]

  const uint6Array = chunkedIn6bits.map(toUInt6); // [42, 23, 45, …]

  return `${toBase64(encodingLength - 1)}${uint6Array.map(toBase64).join("")}`;
};
