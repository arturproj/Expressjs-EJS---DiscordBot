const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
const allUniqueChars = [..."~!@#$%^&*()_+-=[]{}|;:',./<>?"];
const allNumbers = [..."0123456789"];

const base = [
  ...allCapsAlpha,
  ...allNumbers,
  ...allLowerAlpha,
  ...allUniqueChars,
];
const baseString = [...allCapsAlpha, ...allLowerAlpha];
const baseNumber = [...allNumbers];
const baseASCII = [...allUniqueChars];
const PID = [...allCapsAlpha, ...allNumbers];
const generator = (dbase, len, res = "") => {
  for (var i = 0; i < len; i++) {
    res += dbase[(Math.random() * dbase.length) | 0];
  }
  return res;
};

module.exports = (len) => {
  return generator(PID, len);
};
