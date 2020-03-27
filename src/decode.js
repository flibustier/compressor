import {
  BITS_PER_BASE64_SYMBOL,
  DISAMBIGUATION_FLAG,
  chunks,
  fromBase64,
  last,
  toBinaryEncodedIn
} from "./primitives";

const removeAllTrailingBits = bitArray => {
  const lastBit = last(bitArray);

  while (last(bitArray) === lastBit) bitArray.pop();
};

const extractFromBase64URL = base64URL => {
  const [firstChar, ...base64Array] = base64URL.split("");

  const isAmbiguousEnding = last(base64Array) === DISAMBIGUATION_FLAG;

  if (isAmbiguousEnding) base64Array.pop();

  return {
    bitsPerNumber: fromBase64(firstChar) + 1,
    isAmbiguousEnding,
    uint6Array: base64Array.map(fromBase64)
  };
};

const fromBinary = bitArray => parseInt(bitArray.join(""), 2);

export const decode = base64URL => {
  const { bitsPerNumber, isAmbiguousEnding, uint6Array } = extractFromBase64URL(
    base64URL
  );

  const bitArray = uint6Array.flatMap(
    toBinaryEncodedIn(BITS_PER_BASE64_SYMBOL)
  );

  if (isAmbiguousEnding) removeAllTrailingBits(bitArray);

  const chunkedInXBits = chunks(bitArray, bitsPerNumber); // [['1', '0', …], ['0', '1', …], …]

  if (last(chunkedInXBits).length < bitsPerNumber) chunkedInXBits.pop();

  return chunkedInXBits.map(fromBinary);
};
