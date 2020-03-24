import { chunk, last } from "lodash";

import {
  ZERO_ENDING_COMPLETION_FLAG,
  fromBase64,
  toBinaryEncodedIn,
  toFlatBinaryArray
} from "./primitives";

const removeAllTrailingBits = binaryArray => {
  const lastBit = last(binaryArray);

  while (last(binaryArray) === lastBit) binaryArray.pop();
};

export const decode = base64URL => {
  const base64Array = base64URL.split("");

  const bitsPerNumber = fromBase64(base64Array[0]) + 1;

  const lastChar = base64Array.pop();

  if (lastChar !== ZERO_ENDING_COMPLETION_FLAG) base64Array.push(lastChar);

  const uint6Array = base64Array.slice(1).map(fromBase64); // [42, 23, …]

  const binaryArray = toFlatBinaryArray(uint6Array.map(toBinaryEncodedIn(6))); // ['1', '0', '1', …]

  if (lastChar === ZERO_ENDING_COMPLETION_FLAG) {
    removeAllTrailingBits(binaryArray);
  }

  const chunkedInXBits = chunk(binaryArray, bitsPerNumber); // [['1', '0', …], ['0', '1', …], …]

  const lastChunk = chunkedInXBits[chunkedInXBits.length - 1];

  if (lastChunk.length < bitsPerNumber) chunkedInXBits.pop();

  return chunkedInXBits.map(bitArray => parseInt(bitArray.join(""), 2));
};
