import {
  bitsNeeded,
  toBase64,
  toUInt6,
  toBinaryEncodedIn,
  encode,
  fromBase64,
  decode,
  invertBitString
} from "..";

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

describe.each`
  numbers                                                   | base64
  ${[1, 0, 1, 0, 1, 0]}                                     | ${"Aq"}
  ${[1, 2, 3, 0, 1, 3]}                                     | ${"BbH"}
  ${[4, 1, 6, 0, 1, 3]}                                     | ${"ChwL"}
  ${[42, 0, 1, 5, 8, 34, 61, 12]}                           | ${"FqABFIi9M"}
  ${[234, 0, 128, 4, 18, 42, 176, 190, 24, 222]}            | ${"H6gCABBIqsL4Y3g"}
  ${[2340, 0, 1328, 4243, 6874, 278, 1706, 1909, 24, 2223]} | ${"MSSAACmEJPW0EWNVHdQDCK8"}
  ${[4294967295, 4194967295, 4242347295]}                   | ${"f______oKHv_83RUf"}
`("encode", ({ numbers, base64 }) => {
  it(`should return ${base64} for ${numbers}`, () => {
    expect(encode(numbers)).toEqual(base64);
  });
});

describe.each`
  numbers                                 | base64
  ${[1, 0, 1, 0, 1, 0, 1]}                | ${"Aqg="}
  ${[1, 0, 1, 0, 1, 0, 1, 0]}             | ${"Aqv="}
  ${[1, 0, 1, 0, 1, 0, 1, 0, 0]}          | ${"Aqn="}
  ${[1, 0, 1, 0, 1, 0, 1, 0, 0, 1]}       | ${"Aqk="}
  ${[1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0]}    | ${"Aql="}
  ${[1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0]} | ${"Aqk"}
  ${[1, 2, 3, 0, 1, 3, 2, 1, 2, 1, 0]}    | ${"BbHmT="}
  ${[3]}                                  | ${"Bw="}
  ${[3, 0]}                               | ${"Bz="}
  ${[3, 1]}                               | ${"B0="}
  ${[3, 0, 0]}                            | ${"Bw"}
  ${[4, 1, 6, 0, 1, 3, 5, 1, 0, 0]}       | ${"ChwLpA"}
  ${[1, 8, 0]}                            | ${"DGA"}
  ${[1, 8]}                               | ${"DGP="}
  ${[12, 16, 11, 2, 4]}                   | ${"EZBYif="}
`("encode with ambigous ending", ({ numbers, base64 }) => {
  it(`should return ${base64} for ${numbers}`, () => {
    expect(encode(numbers)).toEqual(base64);
  });
});

describe.each`
  base64                       | numbers
  ${"Aq"}                      | ${[1, 0, 1, 0, 1, 0]}
  ${"BbH"}                     | ${[1, 2, 3, 0, 1, 3]}
  ${"ChaLut"}                  | ${[4, 1, 3, 2, 1, 3, 5, 6, 5, 5]}
  ${"Coucou"}                  | ${[5, 0, 5, 6, 3, 4, 5, 0, 5, 6]}
  ${"FqABFIi9M"}               | ${[42, 0, 1, 5, 8, 34, 61, 12]}
  ${"H6gCABBIqsL4Y3g"}         | ${[234, 0, 128, 4, 18, 42, 176, 190, 24, 222]}
  ${"MSSAACmEJPW0EWNVHdQDCK8"} | ${[2340, 0, 1328, 4243, 6874, 278, 1706, 1909, 24, 2223]}
`("decode", ({ base64, numbers }) => {
  it(`should return ${numbers} for ${base64}`, () => {
    expect(decode(base64)).toEqual(numbers);
  });
});

describe.each`
  base64       | numbers
  ${"Aqg="}    | ${[1, 0, 1, 0, 1, 0, 1]}
  ${"Aqv="}    | ${[1, 0, 1, 0, 1, 0, 1, 0]}
  ${"Aqn="}    | ${[1, 0, 1, 0, 1, 0, 1, 0, 0]}
  ${"Aqk="}    | ${[1, 0, 1, 0, 1, 0, 1, 0, 0, 1]}
  ${"Aql="}    | ${[1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0]}
  ${"Aqk"}     | ${[1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0]}
  ${"BbHmT="}  | ${[1, 2, 3, 0, 1, 3, 2, 1, 2, 1, 0]}
  ${"Bw="}     | ${[3]}
  ${"Bz="}     | ${[3, 0]}
  ${"B0="}     | ${[3, 1]}
  ${"Bw"}      | ${[3, 0, 0]}
  ${"ChwLpA"}  | ${[4, 1, 6, 0, 1, 3, 5, 1, 0, 0]}
  ${"DGA"}     | ${[1, 8, 0]}
  ${"DGP="}    | ${[1, 8]}
  ${"EZBYif="} | ${[12, 16, 11, 2, 4]}
`("decode with ambigous ending", ({ base64, numbers }) => {
  it(`should return ${numbers} for ${base64}`, () => {
    expect(decode(base64)).toEqual(numbers);
  });
});

describe.each`
  numbers
  ${[1, 0, 1, 0, 1, 0, 1, 0, 1]}
  ${[1, 2, 3, 0, 1, 3, 2, 1, 2, 0, 1]}
  ${[4, 1, 6, 0, 1, 3, 5, 1]}
  ${[42, 0, 1, 5, 8, 34, 61, 12]}
  ${[234, 0, 128, 4, 18, 42, 176, 190, 24, 222]}
  ${[2340, 0, 1328, 4243, 6874, 278, 1706, 1909, 24, 2223]}
  ${[2342, 20, 1308, 4243, 6874, 278, 1706, 1909, 2456, 2223, 4567, 2345, 7656]}
  ${[4294967295, 42, 4294967295, 4294957295]}
`("encode & decode", ({ numbers }) => {
  it(`should be idempotent for ${numbers}`, () => {
    expect(decode(encode(numbers))).toEqual(numbers);
  });
});
