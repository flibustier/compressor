import { chunk, last } from "lodash";

const BASE64_URL_DEFINITION =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const ZERO_ENDING_COMPLETION_FLAG = "=";
const BASE64_BITS_PER_SYMBOL = 6;
const MAX_SUPPORTED_BITS_PER_NUMBER = 32;

// '1' => '0'
export const invertBitString = bit => (bit == "1" ? "0" : "1");

// 42 => 'q'
export const toBase64 = uint6 => BASE64_URL_DEFINITION[uint6 % 64];

// 'q' => 42
export const fromBase64 = symbol => BASE64_URL_DEFINITION.indexOf(symbol);

// ['1', '0', '1', '0', '1', '0'] => 42
export const toUInt6 = binaryArray => {
  const binaryString = binaryArray.join("").padEnd(BASE64_BITS_PER_SYMBOL, 0);

  return parseInt(binaryString, 2);
};

// 42 => 6 (bits needed: 101010)
export const bitsNeeded = number => {
  if (number === 0) return 1;

  let i = 0;
  while (i < MAX_SUPPORTED_BITS_PER_NUMBER && number >>> i !== 1) i++;

  return i + 1;
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

export const isLastChunkAmbiguous = (lastChunk, encodingLength) =>
  lastChunk.length < BASE64_BITS_PER_SYMBOL &&
  (BASE64_BITS_PER_SYMBOL - lastChunk.length) % encodingLength === 0;

// [4, 1, 6, 0, 1, 3] => 'ChwL'
export const encode = numbers => {
  let flagForZeroAmbiguousEnding = false;

  const bigestNumber = Math.max(...numbers);

  const encodingLength = bitsNeeded(bigestNumber);

  const binaryStrings = numbers.map(toBinaryEncodedIn(encodingLength)); // ['00101010', '00000100', …]

  const binaryArray = toFlatBinaryArray(binaryStrings); // ['1', '0', '1', '1', …]

  const chunkedIn6Bits = chunk(binaryArray, BASE64_BITS_PER_SYMBOL); // [['1' , '0', …], ['1', '1', …], …]

  const lastChunk = chunkedIn6Bits.pop();

  if (isLastChunkAmbiguous(lastChunk, encodingLength)) {
    const lastBitInverted = invertBitString(last(lastChunk));
    lastChunk.push(
      lastBitInverted.repeat(BASE64_BITS_PER_SYMBOL - lastChunk.length)
    );
    flagForZeroAmbiguousEnding = true;
  }

  const uint6Array = [...chunkedIn6Bits, lastChunk].map(toUInt6); // [42, 23, 45, …]

  return `${toBase64(encodingLength - 1)}${uint6Array.map(toBase64).join("")}${
    flagForZeroAmbiguousEnding ? ZERO_ENDING_COMPLETION_FLAG : ""
  }`;
};

export const decode = base64URL => {
  const base64Array = base64URL.split("");

  const bitsPerNumber = fromBase64(base64Array[0]) + 1;

  const lastChar = base64Array.pop();

  if (lastChar !== ZERO_ENDING_COMPLETION_FLAG) base64Array.push(lastChar);

  const uint6Array = base64Array.slice(1).map(fromBase64); // [42, 23, …]

  const binaryArray = toFlatBinaryArray(uint6Array.map(toBinaryEncodedIn(6))); // ['1', '0', '1', …]

  if (lastChar === ZERO_ENDING_COMPLETION_FLAG) {
    const lastBit = last(binaryArray);

    while (last(binaryArray) === lastBit) binaryArray.pop();
  }

  const chunkedInXBits = chunk(binaryArray, bitsPerNumber); // [['1', '0', …], ['0', '1', …], …]

  const lastChunk = chunkedInXBits[chunkedInXBits.length - 1];

  if (lastChunk.length < bitsPerNumber) chunkedInXBits.pop();

  return chunkedInXBits.map(bitArray => parseInt(bitArray.join(""), 2));
};
