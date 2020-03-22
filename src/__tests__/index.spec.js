import { bitsNeeded, toBase64, toUInt6, toBinaryEncodedIn, encode } from '..';

describe.each`
    number | bitsExpected
    ${67}  | ${7}
    ${0}   | ${1}
    ${1}   | ${1}
    ${2}   | ${2}
    ${5}   | ${3}
    ${8}   | ${4}
    ${42}  | ${6}
    ${290} | ${9}
    ${999} | ${10}
    ${2049}| ${12}
  `("bitsNeeded", ({ number, bitsExpected }) => {
  it(`should return ${bitsExpected} bits for ${number}`, () => {
    expect(bitsNeeded(number)).toEqual(bitsExpected);
  });
});

describe.each`
    uint6 | char
    ${0}  | ${'A'}
    ${2}  | ${'C'}
    ${5}  | ${'F'}
    ${8}  | ${'I'}
    ${42} | ${'q'}
    ${60} | ${'8'}
    ${62} | ${'-'}
    ${63} | ${'_'}
    ${64} | ${'A'}
    ${66} | ${'C'}
  `("toBase64", ({ uint6, char }) => {
  it(`should return ${char} for ${uint6}`, () => {
    expect(toBase64(uint6)).toEqual(char);
  });
});

describe.each`
    binaryArray                        | uint6
    ${['1', '0', '1', '0', '1', '0']}  | ${42}
    ${['1', '1', '1', '1', '1', '1']}  | ${63}
    ${['0', '0', '0', '0', '0', '1']}  | ${1}
    ${['0', '0', '0', '0', '0', '0']}  | ${0}
    ${['0', '0', '0', '0']}            | ${0}
    ${[]}                              | ${0}
    ${['0', '1']}                      | ${16}
  `("toUInt6", ({ binaryArray, uint6 }) => {
  it(`should return ${uint6} for ${binaryArray}`, () => {
    expect(toUInt6(binaryArray)).toEqual(uint6);
  });
});

describe.each`
    uint6 | binary
    ${0}  | ${'000000'}
    ${2}  | ${'000010'}
    ${5}  | ${'000101'}
    ${8}  | ${'001000'}
    ${17} | ${'010001'}
    ${60} | ${'111100'}
    ${62} | ${'111110'}
    ${63} | ${'111111'}
    ${64} | ${'000000'}
    ${66} | ${'000010'}
  `("toBinaryEncodedIn 6 bits encoding", ({ uint6, binary }) => {
  it(`should return ${binary} for ${uint6}`, () => {
    expect(toBinaryEncodedIn(6)(uint6)).toEqual(binary);
  });
});

describe.each`
    numbers                                                    | base64
    ${[1, 0, 1, 0, 1, 0]}                                      | ${'Aq'}
    ${[1, 2, 3, 0, 1, 3]}                                      | ${'BbH'}
    ${[4, 1, 6, 0, 1, 3]}                                      | ${'ChwL'}
    ${[42, 0, 1, 5, 8, 34, 61, 12]}                            | ${'FqABFIi9M'}
    ${[234, 0, 128, 4, 18, 42, 176, 190, 24, 222]}             | ${'H6gCABBIqsL4Y3g'}
    ${[2340, 0, 1328, 4243, 6874, 278, 1706, 1909, 24, 2223]}  | ${'MSSAACmEJPW0EWNVHdQDCK8'}
    ${[2340495849301948, 1928404937749208, 1002740907797470]}  | ${'dnsie8DTDLYPnGve'}
  `("encode", ({ numbers, base64 }) => {
  it(`should return ${base64} for ${numbers}`, () => {
    expect(encode(numbers)).toEqual(base64);
  });
});
