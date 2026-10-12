import { parsePhoneNumberFromString } from "libphonenumber-js/mobile";

// Parses what the guest typed against Google's numbering rules (mobile only).
// Accepts spaces, dashes, brackets, a leading trunk 0 or a pasted +<code>.
// Returns null for anything that is not a real mobile number format.
export function parseMobile(countryCode: string, phone: string) {
  const input = phone.trim();
  if (!/^[+\d\s().-]+$/.test(input)) return null;
  const parsed = parsePhoneNumberFromString(
    input.startsWith("+") ? input : countryCode + input,
  );
  return parsed?.isValid() ? parsed : null;
}

// True when the guest adds to a complete mobile number and makes it invalid.
// The form refuses that input, so typing stops at the end of a real number.
export function isPastFullNumber(countryCode: string, prev: string, next: string) {
  return (
    next.length > prev.length &&
    !!parseMobile(countryCode, prev) &&
    !parseMobile(countryCode, next)
  );
}
