import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../utils/api';

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Steps: 'email' → 'code' → 'done'
  const [step, setStep] = useState('email');

  // Shared
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Step 1 — email
  const [email, setEmail] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef(null);

  // Step 2 — code + new password
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Dev-mode fallback code
  const [devCode, setDevCode] = useState('');

  // Cleanup cooldown timer
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  // Start a 60-second cooldown after sending code
  const startCooldown = () => {
    setCooldown(60);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ─── Step 1: Send code ────────────────────────────────
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (sendingCode || cooldown > 0) return; // prevent double clicks

    setError('');
    setMessage('');
    setDevCode('');
    setSendingCode(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });

      // If email service sent it
      if (data.emailSent) {
        setMessage(`Reset code sent to ${email}. Check your inbox (and spam folder).`);
      }
      // Dev-mode fallback
      if (data.resetToken) {
        setDevCode(data.resetToken);
      }

      setStep('code');
      startCooldown();
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach the server. Please make sure the backend is running.');
      } else if (err.response.status === 429) {
        setError('Too many attempts. Please wait a few minutes and try again.');
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSendingCode(false);
    }
  };

  // ─── Resend code (same email) ──────────────────────────
  const handleResend = async () => {
    if (sendingCode || cooldown > 0) return;
    setError('');
    setMessage('');
    setDevCode('');
    setSendingCode(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      if (data.emailSent) {
        setMessage(`A new code has been sent to ${email}.`);
      }
      if (data.resetToken) setDevCode(data.resetToken);
      startCooldown();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setSendingCode(false);
    }
  };

  // ─── Step 2: Reset password ───────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetting) return;

    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setResetting(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        token: code,
        password,
      });
      setMessage(data.message);
      setStep('done');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setResetting(false);
    }
  };

  // ─── Step headers ─────────────────────────────────────
  const headers = {
    email: {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      ),
      urdu: 'پاسورڈ بھول گئے؟',
      sub: "Enter your email address and we'll send you a reset code.",
    },
    code: {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      ),
      urdu: 'نیا پاسورڈ مقرر کریں',
      sub: 'Enter the 6-digit code from your email and choose a new password.',
    },
    done: {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M5 13l4 4L19 7" />
      ),
      urdu: 'پاسورڈ تبدیل ہو گیا',
      sub: 'Your password has been reset successfully.',
    },
  };

  const h = headers[step];

  return (
    <div className="min-h-screen bg-main flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {h.icon}
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-heading font-urdu mb-2 leading-relaxed">{h.urdu}</h1>
          <p className="text-muted mt-4 text-sm">{h.sub}</p>

          {/* Step indicator */}
          {step !== 'done' && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {['email', 'code'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                    ${step === s ? 'bg-accent text-white' : s === 'email' && step === 'code' ? 'bg-green-500 text-white' : 'bg-card-hover text-muted'}`}>
                    {s === 'email' && step === 'code' ? '✓' : i + 1}
                  </div>
                  {i === 0 && <div className={`w-8 h-0.5 ${step === 'code' ? 'bg-green-500' : 'bg-card-hover'}`} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Card ── */}
        <div className="card p-6 sm:p-8">

          {/* Error */}
          {error && (
            <div className="alert-error mb-4 p-3 rounded-lg text-sm">{error}</div>
          )}

          {/* Success message */}
          {message && (
            <div className="mb-4 p-3 rounded-lg border-2 border-green-500/30 bg-green-500/5 text-sm text-green-400 font-medium text-center">
              {message}
            </div>
          )}

          {/* Dev-mode fallback code */}
          {devCode && step === 'code' && (
            <div className="mb-4 p-4 rounded-lg border-2 border-accent/40 bg-accent/5 text-center">
              <p className="text-xs text-muted mb-1">Dev mode — your reset code:</p>
              <p className="text-3xl font-mono font-bold text-accent tracking-widest">{devCode}</p>
            </div>
          )}

          {/* ═══════ STEP 1: Email ═══════ */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-body mb-1">Email Address</label>
                <input
                  id="email" type="email" required dir="ltr"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full" placeholder="you@example.com"
                />
              </div>
              <button type="submit" disabled={sendingCode}
                className="btn-gold w-full py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
                {sendingCode && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {sendingCode ? 'Sending Code...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {/* ═══════ STEP 2: Code + New Password ═══════ */}
          {step === 'code' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* 6-digit code */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-body mb-1">Reset Code</label>
                <input
                  id="code" type="text" required dir="ltr" maxLength={6} autoFocus
                  value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="input-field w-full text-center text-xl tracking-widest font-mono"
                  placeholder="000000"
                />
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-body mb-1">New Password</label>
                <div className="relative">
                  <input
                    id="password" type={showPassword ? 'text' : 'password'} required minLength={6} dir="ltr"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="input-field w-full pr-10" placeholder="At least 6 characters"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-body transition-colors">
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-body mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword" type={showConfirm ? 'text' : 'password'} required minLength={6} dir="ltr"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field w-full pr-10" placeholder="Re-enter your new password"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-body transition-colors">
                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={resetting || code.length !== 6}
                className="btn-gold w-full py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
                {resetting && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {resetting ? 'Resetting...' : 'Reset Password'}
              </button>

              {/* Resend code */}
              <div className="text-center pt-1">
                <p className="text-xs text-muted">
                  Didn't receive the code?{' '}
                  {cooldown > 0 ? (
                    <span className="text-accent font-medium">Resend in {cooldown}s</span>
                  ) : (
                    <button type="button" onClick={handleResend} disabled={sendingCode}
                      className="text-accent hover:underline font-medium disabled:opacity-50">
                      {sendingCode ? 'Sending...' : 'Resend Code'}
                    </button>
                  )}
                </p>
              </div>

              {/* Back to step 1 */}
              <div className="text-center">
                <button type="button" onClick={() => { setStep('email'); setError(''); setMessage(''); setDevCode(''); setCode(''); }}
                  className="text-xs text-muted hover:text-body transition-colors">
                  ← Change email address
                </button>
              </div>
            </form>
          )}

          {/* ═══════ STEP 3: Done ═══════ */}
          {step === 'done' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-muted">Redirecting to login...</p>
            </div>
          )}

          {/* Back to login */}
          <p className="text-center text-muted text-sm mt-6">
            {step === 'email' ? 'Remember your password? ' : ''}
            <Link to="/login" className="text-accent hover:underline font-medium">
              {step === 'email' ? 'Back to Login' : '← Back to Login'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
