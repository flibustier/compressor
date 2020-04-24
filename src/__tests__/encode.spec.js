import { encode } from "../encode";

describe.each`
  numbers                                                   | base64
  ${[]}                                                     | ${""}
  ${[1, 0, 1, 0, 1, 0]}                                     | ${"Aq"}
  ${[1, 2, 3, 0, 1, 3]}                                     | ${"BbH"}
  ${[4, 1, 6, 0, 1, 3]}                                     | ${"ChwL"}
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
