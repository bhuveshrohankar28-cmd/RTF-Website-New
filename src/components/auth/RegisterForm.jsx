// src/components/auth/RegisterForm.jsx
// ─────────────────────────────────────────────────────────────
// THIS COMPONENT IS THE TEMPLATE. When you build any other form
// (ApplicationForm, MailComposer, etc.), copy this exact pattern:
//
//   1. useForm + zodResolver → gives you register(), handleSubmit(),
//      and formState.errors for free, matched against a zod schema
//   2. handleSubmit(onSubmit) → onSubmit only ever runs with data
//      that ALREADY passed frontend validation
//   3. Inside onSubmit: call the service function, not axios directly
//   4. On success → tell the parent (via a callback prop) so IT
//      decides what happens next (redirect, show message, etc.) —
//      this component doesn't own navigation logic
//   5. On error → distinguish field-level errors (show under the
//      specific input) from general errors (show as a banner/toast)
// ─────────────────────────────────────────────────────────────

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { registerSchema } from '../../utils/validators';
import { registerUser } from '../../services/authService';
import NeoButton from '../ui/NeoButton'; // reuse existing UI — don't rebuild a button

const DOMAIN_OPTIONS = [
  { value: 'software', label: 'Software Domain' },
  { value: 'electrical', label: 'Electrical Domain' },
  { value: 'aeromech', label: 'Aeronautics & Mechanical Domain' },
];

/**
 * @param {{ onSuccess: (message: string) => void }} props
 *   onSuccess is called with a message once registration succeeds —
 *   the parent page (Register.jsx) decides what to render next.
 */
export default function RegisterForm({ onSuccess }) {
  // formState.errors is populated automatically by zodResolver —
  // no manual validation code needed here at all.
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(registerSchema) });

  // Separate from field errors — this is for errors that aren't
  // tied to one specific input (e.g. "email already registered",
  // or "server unreachable").
  const [formError, setFormError] = useState(null);

  // react-hook-form only calls this if validation already passed.
  const onSubmit = async (data) => {
    setFormError(null);

    // confirmPassword is only for the frontend check — strip it
    // before sending to the backend, which doesn't expect it.
    const { confirmPassword, ...payload } = data;

    try {
      const result = await registerUser(payload);
      onSuccess(result.message); // parent shows "pending approval" screen
    } catch (err) {
      if (err.fieldErrors) {
        // Backend rejected specific fields (rare, since frontend
        // already validated — but possible, e.g. a race condition
        // on the email-already-exists check). Map them onto the
        // same fields react-hook-form is tracking.
        Object.entries(err.fieldErrors).forEach(([field, messages]) => {
          setError(field, { message: messages[0] });
        });
      } else {
        // General error (duplicate email, server down, etc.) —
        // shown as a banner above the form, not tied to one field.
        setFormError(err.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {formError && (
        <div className="rounded-md bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-2 text-sm">
          {formError}
        </div>
      )}

      <div>
        <input {...register('name')} placeholder="Full Name" className="input" />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <input {...register('collegeEnrollmentNo')} placeholder="College Enrollment No." className="input" />
        {errors.collegeEnrollmentNo && (
          <p className="text-red-400 text-xs mt-1">{errors.collegeEnrollmentNo.message}</p>
        )}
      </div>

      <div>
        <input {...register('collegeEmail')} placeholder="College Email" className="input" />
        {errors.collegeEmail && <p className="text-red-400 text-xs mt-1">{errors.collegeEmail.message}</p>}
      </div>

      <div>
        <input {...register('personalEmail')} placeholder="Personal Email" className="input" />
        {errors.personalEmail && (
          <p className="text-red-400 text-xs mt-1">{errors.personalEmail.message}</p>
        )}
      </div>

      <div>
        <input {...register('branch')} placeholder="Branch" className="input" />
        {errors.branch && <p className="text-red-400 text-xs mt-1">{errors.branch.message}</p>}
      </div>

      <div>
        <input
          {...register('yearOfPassing')}
          type="number"
          placeholder="Year of Passing"
          className="input"
        />
        {errors.yearOfPassing && (
          <p className="text-red-400 text-xs mt-1">{errors.yearOfPassing.message}</p>
        )}
      </div>

      <div>
        <input {...register('phone')} placeholder="Phone Number" className="input" />
        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <select {...register('domain')} className="input" defaultValue="">
          <option value="" disabled>
            Select Domain
          </option>
          {DOMAIN_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.domain && <p className="text-red-400 text-xs mt-1">{errors.domain.message}</p>}
      </div>

      <div>
        <input {...register('password')} type="password" placeholder="Password" className="input" />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <input
          {...register('confirmPassword')}
          type="password"
          placeholder="Confirm Password"
          className="input"
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* isSubmitting comes free from react-hook-form — disable the
          button and show loading state while the API call is in flight,
          so the user can't double-submit. */}
      <NeoButton type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Register'}
      </NeoButton>
    </form>
  );
}