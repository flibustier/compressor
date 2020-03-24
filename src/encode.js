import { chunk, last } from "lodash";

import {
  bitsNeeded,
  invertBitString,
  toBinaryEncodedIn,
  toFlatBinaryArray,
  toBase64,
  toUInt6,
  BASE64_BITS_PER_SYMBOL,
  ZERO_ENDING_COMPLETION_FLAG
} from "./primitives";

const isLastChunkAmbiguous = (lastChunk, encodingLength) =>
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
