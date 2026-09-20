import { useState } from 'react';
import { X } from 'lucide-react';
import HoloCard from '../ui/HoloCard';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

/**
 * AuthCard — single container that toggles between the "Log in" and
 * "Create Account" views, matching the reference screenshots structurally
 * while using the site's existing HoloCard / NeoButton / design tokens.
 *
 * Usage:
 *   <AuthCard
 *     onLogin={async ({ identifier, password }) => { ... }}
 *     onSignUp={async ({ email, password }) => { ... }}
 *     onGoogleAuth={() => { ... }}
 *     onForgotPassword={() => { ... }}
 *   />
 *
 * Pass `onClose` if this is rendered inside a modal/dialog — it renders
 * the top-right "X" seen in the reference screenshots. Omit it (e.g. when
 * used as a full page like pages/Login.jsx) and the close button is hidden.
 *
 * @param {object} props
 * @param {'login'|'signup'} [props.initialView='login']
 * @param {() => void} [props.onClose]
 * @param {(credentials: { identifier: string, password: string }) => void|Promise<void>} [props.onLogin]
 * @param {(data: { email: string, password: string }) => void|Promise<void>} [props.onSignUp]
 * @param {() => void} [props.onGoogleAuth]
 * @param {() => void} [props.onForgotPassword]
 * @param {string} [props.className]
 */
export default function AuthCard({
  initialView = 'login',
  onClose,
  onLogin,
  onSignUp,
  onGoogleAuth,
  onForgotPassword,
  className = '',
}) {
  const [view, setView] = useState(initialView);

  return (
    <HoloCard glow="cyan" className={`relative p-8 ${className}`}>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={20} />
        </button>
      )}

      {view === 'login' ? (
        <LoginForm
          onSwitchToSignup={() => setView('signup')}
          onSubmit={onLogin}
          onGoogleAuth={onGoogleAuth}
          onForgotPassword={onForgotPassword}
        />
      ) : (
        <SignUpForm
          onSwitchToLogin={() => setView('login')}
          onSubmit={onSignUp}
          onGoogleAuth={onGoogleAuth}
        />
      )}
    </HoloCard>
  );
}