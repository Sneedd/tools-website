const DIGIT_CHARS = "0123456789";
const NORMAL_SPECIAL_CHARS = "=-+#_.*";
const SPECIAL_CHARS = "$%&§/=?\"!";
const EXTRA_SPECIAL_CHARS = ";,:.<>|@'~\\{}[]()";

const SYLLABLES: readonly string[] = [
  "ba", "be", "bi", "bo", "bu",
  "da", "de", "di", "do", "du",
  "fa", "fe", "fi", "fo", "fu",
  "ga", "ge", "gi", "go", "gu",
  "ka", "ke", "ki", "ko", "ku",
  "la", "le", "li", "lo", "lu",
  "ma", "me", "mi", "mo", "mu",
  "na", "ne", "ni", "no", "nu",
  "pa", "pe", "pi", "po", "pu",
  "ra", "re", "ri", "ro", "ru",
  "sa", "se", "si", "so", "su",
  "ta", "te", "ti", "to", "tu",
  "lan", "ron", "tri", "zor", "kel",
  "var", "nox", "tan", "mir", "fal",
  "gor", "wen", "dor", "zin", "bel",
];

function randomInt(maxExclusive: number): number {
  const maxUint32 = 0xFFFFFFFF;
  const limit = maxUint32 - (maxUint32 % maxExclusive);
  const arr = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(arr);
    value = arr[0];
  } while (value >= limit);
  return value % maxExclusive;
}

function randomChar(charset: string): string {
  return charset[randomInt(charset.length)];
}

function randomFloatInRange(min: number, max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  const fraction = arr[0] / 0x100000000;
  return min + fraction * (max - min);
}

function capitalizeFirstChar(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export interface PronounceablePasswordOptions {
  length: number;
  includeNumbers: boolean;
  includeNormalSpecial: boolean;
  includeSpecial: boolean;
  includeExtraSpecial: boolean;
}

export function generatePronounceablePassword(options: PronounceablePasswordOptions): string {
  const totalLength = options.length;

  let fillerCharset = "";
  if (options.includeNumbers) fillerCharset += DIGIT_CHARS;
  if (options.includeNormalSpecial) fillerCharset += NORMAL_SPECIAL_CHARS;
  if (options.includeSpecial) fillerCharset += SPECIAL_CHARS;
  if (options.includeExtraSpecial) fillerCharset += EXTRA_SPECIAL_CHARS;
  if (fillerCharset === "") fillerCharset = DIGIT_CHARS;

  const fraction = randomFloatInRange(0.75, 0.85);
  const targetStemLength = Math.min(Math.max(Math.round(totalLength * fraction), 1), totalLength - 1);

  const tokens: string[] = [];
  let stemLength = 0;
  while (stemLength < targetStemLength) {
    let syllable = SYLLABLES[randomInt(SYLLABLES.length)];
    if (randomFloatInRange(0, 1) < 0.15) syllable = capitalizeFirstChar(syllable);
    tokens.push(syllable);
    stemLength += syllable.length;
  }

  const maxStemLength = totalLength - 1;
  while (stemLength > maxStemLength && tokens.length > 1) {
    stemLength -= tokens.pop()!.length;
  }
  if (stemLength > maxStemLength) {
    const overshoot = stemLength - maxStemLength;
    tokens[0] = tokens[0].slice(0, tokens[0].length - overshoot);
    stemLength = maxStemLength;
  }

  if (!tokens.some(token => /[A-Z]/.test(token))) {
    const idx = randomInt(tokens.length);
    tokens[idx] = capitalizeFirstChar(tokens[idx]);
  }

  const fillerCount = totalLength - stemLength;
  const fillerChars: string[] = [];
  for (let i = 0; i < fillerCount; i++) fillerChars.push(randomChar(fillerCharset));

  const buckets: string[][] = Array.from({ length: tokens.length + 1 }, () => []);
  for (const c of fillerChars) buckets[randomInt(buckets.length)].push(c);

  let result = "";
  for (let i = 0; i < tokens.length; i++) {
    result += buckets[i].join("") + tokens[i];
  }
  result += buckets[tokens.length].join("");

  return result;
}
