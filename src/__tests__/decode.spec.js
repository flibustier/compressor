import { decode } from "../decode";

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
