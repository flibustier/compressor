import {
  BITS_PER_BASE64_SYMBOL,
  DISAMBIGUATION_FLAG,
  bitsNeeded,
  chunks,
  last,
  toBase64,
  toBinaryEncodedIn,
  toUInt6
} from "./primitives";

const isLastChunkAmbiguous = (lastChunk, encodingLength) =>
  lastChunk.length < BITS_PER_BASE64_SYMBOL &&
  (BITS_PER_BASE64_SYMBOL - lastChunk.length) % encodingLength === 0;

const formatOutput = (encodingLength, uint6Array, isAmbiguousEnding) => {
  const firstCharacter = toBase64(encodingLength - 1);
  const data = uint6Array.map(toBase64).join("");
  const optionalEnding = isAmbiguousEnding ? DISAMBIGUATION_FLAG : "";

  return `${firstCharacter}${data}${optionalEnding}`;
};

// [4, 1, 6, 0, 1, 3] => 'ChwL'
export const encode = numbers => {
  let isAmbiguousEnding = false;

  const biggestNumber = Math.max(...numbers);

  const encodingLength = bitsNeeded(biggestNumber);

  const bitArray = numbers.flatMap(toBinaryEncodedIn(encodingLength)); // ['1', '0', '1', '1', …]

  const chunkedIn6Bits = chunks(bitArray, BITS_PER_BASE64_SYMBOL); // [['1' , '0', …], ['1', '1', …], …]

  const lastChunk = chunkedIn6Bits.pop();

  if (isLastChunkAmbiguous(lastChunk, encodingLength)) {
    const lastInvertedBit = last(lastChunk) == "1" ? "0" : "1";
    lastChunk.push(
      lastInvertedBit.repeat(BITS_PER_BASE64_SYMBOL - lastChunk.length)
    );
    isAmbiguousEnding = true;
  }

  const uint6Array = [...chunkedIn6Bits, lastChunk].map(toUInt6); // [42, 23, 45, …]

  return formatOutput(encodingLength, uint6Array, isAmbiguousEnding);
};
