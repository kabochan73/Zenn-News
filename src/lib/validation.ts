export const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;
export const PASSWORD_MIN_LENGTH = 8;

export function isValidUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username);
}

export function isValidPassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH;
}
