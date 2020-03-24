import {
  bitsNeeded,
  toBase64,
  toUInt6,
  toBinaryEncodedIn,
  fromBase64,
  invertBitString
} from "../primitives";

describe("invertBitString", () => {
  it("should invert a bit", () => {
    expect(invertBitString("1")).toEqual("0");
    expect(invertBitString("0")).toEqual("1");
  });
});

describe.each`
  number              | bitsExpected
  ${67}               | ${7}
  ${0}                | ${1}
  ${1}                | ${1}
  ${2}                | ${2}
  ${5}                | ${3}
  ${8}                | ${4}
  ${42}               | ${6}
  ${290}              | ${9}
  ${999}              | ${10}
  ${2049}             | ${12}
  ${4294967295}       | ${32}
  ${9007199254740991} | ${32}
`("bitsNeeded", ({ number, bitsExpected }) => {
  it(`should return ${bitsExpected} bits for ${number}`, () => {
    expect(bitsNeeded(number)).toEqual(bitsExpected);
  });
});

describe.each`
  char   | uint6
  ${"A"} | ${0}
  ${"C"} | ${2}
  ${"F"} | ${5}
  ${"I"} | ${8}
  ${"q"} | ${42}
  ${"8"} | ${60}
  ${"-"} | ${62}
  ${"_"} | ${63}
`("fromBase64", ({ char, uint6 }) => {
  it(`should return ${uint6} for ${char}`, () => {
    expect(fromBase64(char)).toEqual(uint6);
  });
});

describe.each`
  uint6 | char
  ${0}  | ${"A"}
  ${2}  | ${"C"}
  ${5}  | ${"F"}
  ${8}  | ${"I"}
  ${42} | ${"q"}
  ${60} | ${"8"}
  ${62} | ${"-"}
  ${63} | ${"_"}
  ${64} | ${"A"}
  ${66} | ${"C"}
`("toBase64", ({ uint6, char }) => {
  it(`should return ${char} for ${uint6}`, () => {
    expect(toBase64(uint6)).toEqual(char);
  });
});

describe.each`
  binaryArray                       | uint6
  ${["1", "0", "1", "0", "1", "0"]} | ${42}
  ${["1", "1", "1", "1", "1", "1"]} | ${63}
  ${["0", "0", "0", "0", "0", "1"]} | ${1}
  ${["0", "0", "0", "0", "0", "0"]} | ${0}
  ${["0", "0", "0", "0"]}           | ${0}
  ${[]}                             | ${0}
  ${["0", "1"]}                     | ${16}
`("toUInt6", ({ binaryArray, uint6 }) => {
  it(`should return ${uint6} for ${binaryArray}`, () => {
    expect(toUInt6(binaryArray)).toEqual(uint6);
  });
});

describe.each`
  uint6 | binary
  ${0}  | ${"000000"}
  ${2}  | ${"000010"}
  ${5}  | ${"000101"}
  ${8}  | ${"001000"}
  ${17} | ${"010001"}
  ${60} | ${"111100"}
  ${62} | ${"111110"}
  ${63} | ${"111111"}
  ${64} | ${"000000"}
  ${66} | ${"000010"}
`("toBinaryEncodedIn 6 bits encoding", ({ uint6, binary }) => {
  it(`should return ${binary} for ${uint6}`, () => {
    expect(toBinaryEncodedIn(6)(uint6)).toEqual(binary);
  });
});
