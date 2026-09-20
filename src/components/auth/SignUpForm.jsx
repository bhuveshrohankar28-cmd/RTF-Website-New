import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import NeoButton from '../ui/NeoButton';

/**
 * SignUpForm — "Create Account" view.
 *
 * NOTE: this is intentionally a separate, lightweight component from
 * `RegisterForm.jsx` (which drives the full member-application flow with
 * enrollment number / domain / etc. via `authService.registerUser`). This
 * one matches the simple email+password "Create Account" screenshot the
 * user asked for. If both are meant to submit to the same backend route,
 * wire `onSubmit` here to whichever service function is appropriate.
 *
 * Structure:
 *   1. Header — title + "Already have an account? Log in" toggle
 *   2. Email field
 *   3. Password field w/ show/hide toggle
 *   4. Full-width "Sign Up" submit button
 *   5. "or" divider
 *   6. Full-width "Continue with Google" button
 *
 * @param {object} props
 * @param {() => void} props.onSwitchToLogin - called when "Log in" is clicked
 * @param {(data: { email: string, password: string }) => void|Promise<void>} [props.onSubmit]
 * @param {() => void} [props.onGoogleAuth]
 */
export default function SignUpForm({ onSwitchToLogin, onSubmit, onGoogleAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in both fields.');
      return;
    }

    if (!onSubmit) {
      setError('Member portal coming soon. Contact RTF leader for access.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ email: email.trim(), password });
    } catch (err) {
      setError(err?.message || 'Unable to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-h2 text-text-primary">Create Account</h2>
        <p className="text-sm text-text-secondary mt-2">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            Log in
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="text-label text-text-muted block mb-2">
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="email"
              id="signup-email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gcoea.ac.in"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 bg-elevated border border-border rounded-button text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="text-label text-text-muted block mb-2">
            Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="signup-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="new-password"
              className="w-full pl-10 pr-11 py-3 bg-elevated border border-border rounded-button text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-button">
            <p className="text-xs font-mono text-amber-400">{error}</p>
          </div>
        )}

        <NeoButton type="submit" disabled={isSubmitting} className="w-full justify-center">
          {isSubmitting ? 'Creating account…' : 'Sign Up'}
        </NeoButton>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-mono text-text-muted uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Continue with Google */}
      <button
        type="button"
        onClick={onGoogleAuth}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-elevated border border-border rounded-button text-sm font-medium text-text-primary hover:bg-elevated/80 hover:border-cyan-500/40 transition-all"
      >
        <FcGoogle size={18} />
        Continue with Google
      </button>
    </div>
  );
}