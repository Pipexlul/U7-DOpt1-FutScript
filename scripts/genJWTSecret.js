import crypto from "crypto";

const clampNumber = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};
const generateJWTSecret = (length = 32) => {
  return crypto.randomBytes(length).toString("base64url");
};

let secretLength;

const args = process.argv.slice(2);
if (typeof args[0] === "string") {
  const numLength = parseInt(args[0]);
  if (!isNaN(numLength)) {
    secretLength = clampNumber(numLength, 16, 64);
  }
}

const secret = generateJWTSecret(secretLength);
console.log("secret:");
console.log(secret);
