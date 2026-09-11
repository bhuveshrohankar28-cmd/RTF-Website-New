// src/utils/validators.js
// ─────────────────────────────────────────────────────────────
// Frontend validation MIRRORS the backend's zod schema
// (backend/validators/authValidators.js) — same rules, so the
// user gets instant feedback in the browser instead of waiting
// for a round trip to find out their password is too short.
//
// IMPORTANT: this does NOT replace backend validation. The
// backend validates again, independently — never trust the
// frontend alone, since a request could bypass the UI entirely.
// ─────────────────────────────────────────────────────────────

import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    collegeEnrollmentNo: z.string().min(3, 'Enter a valid enrollment number'),
    collegeEmail: z.string().email('Enter a valid college email'),
    personalEmail: z.string().email('Enter a valid personal email'),
    branch: z.string().min(2, 'Branch is required'),
    yearOfPassing: z.coerce
      .number()
      .int()
      .min(2024, 'Year of passing looks invalid')
      .max(2035, 'Year of passing looks invalid'),
    phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
    domain: z.enum(['software', 'electrical', 'aeromech'], {
      errorMap: () => ({ message: 'Choose a domain' }),
    }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string(),
  })
  // cross-field validation: confirmPassword must match password.
  // This only exists on the frontend — there's no need to send
  // confirmPassword to the backend at all.
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // shows the error under this specific field
  });