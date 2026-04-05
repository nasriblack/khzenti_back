/**
 * Email validation using RFC 5322 compliant regex
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/**
 * Normalize email address (lowercase and trim)
 */
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/**
 * Check if email domain is from a disposable email service
 */
export const isDisposableEmail = (email: string): boolean => {
  const disposableDomains = [
    "tempmail.com",
    "guerrillamail.com",
    "10minutemail.com",
    "throwaway.email",
    "mailinator.com",
    "maildrop.cc",
    "yopmail.com",
    "temp-mail.org",
    "getnada.com",
    "trashmail.com",
    "fakeinbox.com",
    "sharklasers.com",
    "grr.la",
    "guerrillamail.biz",
    "guerrillamail.de",
    "spam4.me",
    "tempinbox.com",
    "mintemail.com",
    "emailondeck.com",
    "mytrashmail.com",
    "mohmal.com",
    "mailnesia.com",
    "temp-mail.io",
    "dispostable.com",
    "tmpmail.net",
  ];

  const domain = email.split("@")[1]?.toLowerCase();
  return disposableDomains.includes(domain);
};

/**
 * Validate email with all constraints
 */
export const validateEmailConstraints = (
  email: string,
): {
  valid: boolean;
  error?: string;
} => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return { valid: false, error: "Email is required" };
  }

  if (!isValidEmail(normalizedEmail)) {
    return { valid: false, error: "Invalid email format" };
  }

  if (isDisposableEmail(normalizedEmail)) {
    return {
      valid: false,
      error: "Disposable email addresses are not allowed",
    };
  }

  return { valid: true };
};
