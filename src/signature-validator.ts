/**
 * Signature validation utilities.
 *
 * Used to verify that uploaded signature images meet quality requirements
 * before being stored as attendance proof.
 */

export interface SignatureValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Checks whether a signature image buffer is monochrome (black & white).
 * Signatures should be monochrome — color images likely indicate a photo
 * or screenshot rather than an actual signature.
 *
 * TODO: Implement actual pixel analysis.
 * Currently stubbed to always return true for development.
 */
export function isMonochrome(buffer: Buffer): boolean {
  // STUB: always returns true — needs real implementation
  return true;
}

/**
 * Checks whether a signature image buffer contains actual content
 * (not just a blank/empty canvas).
 *
 * A signature is considered non-empty if the buffer has more than
 * a minimal header size, indicating pixel data is present.
 */
export function isNonEmpty(buffer: Buffer): boolean {
  if (!buffer || buffer.length === 0) {
    return false;
  }
  // A valid PNG with actual content will be larger than just the header
  return buffer.length > 100;
}

/**
 * Runs all validation checks on a signature buffer.
 */
export function validateSignature(buffer: Buffer): SignatureValidationResult {
  if (!isNonEmpty(buffer)) {
    return { isValid: false, reason: 'Signature image is empty' };
  }

  if (!isMonochrome(buffer)) {
    return { isValid: false, reason: 'Signature must be monochrome (black and white)' };
  }

  return { isValid: true };
}
