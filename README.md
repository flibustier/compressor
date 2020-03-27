<h2 align="center">Efficient encoding for Javascript numbers into Base 64 URL</h2>

<p align="center">
  <a href="https://github.com/prettier/prettier/actions?query=workflow%3ALint+branch%3Amaster">
    <img alt="Github Actions Build Status" src="https://img.shields.io/github/workflow/status/prettier/prettier/Lint?label=Lint&style=flat-square"></a>
  <a href="https://codecov.io/gh/prettier/prettier">
    <img alt="Codecov Coverage Status" src="https://img.shields.io/codecov/c/github/prettier/prettier.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/prettier">
    <img alt="npm version" src="https://img.shields.io/npm/v/prettier.svg?style=flat-square"></a>
  <a href="#badge">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a>
</p>

## Intro

Compressor is a Javascript encoder/decoder for array of numbers. It encodes numbers into an efficient [Base 64 URL](https://en.wikipedia.org/wiki/Base64#URL_applications) string.

### Input

```js
[5, 0, 5, 6, 3, 4, 5, 0, 5, 6];
```

### Output

```js
"Coucou";
```

Compressor can encode any array of numbers, and decode Base 64 URL string.

## Usage

### Encode

```js
encode([1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1]));
```

Returns `"Ahh"`

### Decode

```js
decode("ChaLut");
```

Returns `[4, 1, 3, 2, 1, 3, 5, 6, 5, 5]`

## Use case

The original use case was to send an array of numbers directly in URL, like this:
`myapplication.io/?collection=[1, 2, 3, 4, 50, 600…]`

But this is not an efficient way of doing so, because each digit will use a character (which is 8 or 16 bits), each comma separator will also use a character, and each bracket…

So we look for an alternative, like encoding into Base 64

### Why not using [btoa](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa) ?

`btoa` is used to transform [`Binary String`](https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary) into ASCII Base 64.

Example:

```js
btoa([1, 2, 3, 4, 5, 6, 7, 8]);
```

Returns `"MSwyLDMsNCw1LDYsNyw4"`

```js
atob("MSwyLDMsNCw1LDYsNyw4");
```

Returns `"1,2,3,4,5,6,7,8"`

This is very inefficient, you will use 16 bits per each digit (due to UTF-16 used for binary string), + 16 bits for each `','` delimiter…

You can try to optimize this, using for example [Typed Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

```js
var buffer = new Uint8Array(input);
var binary = "";
for (var b = 0; b < buffer.byteLength; b++) {
  binary += String.fromCharCode(buffer[b]);
}
return window.btoa(binary);
```

Example: `input = [1,2,3,4,5,6]` returns `"AQIDBAUG"`

This is better, but not optimal.

It got several flaws, beginning to size limitation in your input (8 bits per number, which won’t let you use numbers greater than 255), and increasing the total size as `String.fromCharCode` will encode into 16 bits…

You can also try to combine two `8 bits integers` into one `16 bits char`:

```js
const [first, second] = [42, 12];

String.fromCharCode((first << 8) + second); // returns "⨌"
```

Unfortunately `btoa` doesn’t accept out of ASCII range characters…

## How is this working ?

The first optimization is finding the smallest size for encoding each numbers gave to the `encode` function.

For example, taking the following input `[1, 2, 3, 0, 2, 3, 1, 3, 2, 2, 3, 0, 0, 3, 1]`

`2` bits are needed to encode each number (as it could contain 0, 1, 2, or 3)

Giving that, the first Base 64 character of the output is this number of bits used for encoding each number.

Example: `2` bits => the output will begin with `B` character.

Next, each number is grouped into 6 bits packet for creating a Base 64 symbol.

Example: `[1, 2, 3]` => became `01 10 11` which is `b` in Base 64.

Resulting into `BbLesN` (more compact than `[1, 2, 3, 0, 2, 3, 1, 3, 2, 2, 3, 0, 0, 3, 1]` isn’t it?)
