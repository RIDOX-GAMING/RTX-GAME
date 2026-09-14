import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Gamepad2,
} from "lucide-react";

import {
  loginUser,
  loginWithGoogle,
} from "../services/auth";

import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("ایمیل را وارد کنید.");
      return;
    }

    if (!password) {
      setError("رمز عبور را وارد کنید.");
      return;
    }

    setLoading(true);

    try {
      await loginUser(
        email.trim().toLowerCase(),
        password
      );

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        "ایمیل یا رمز عبور اشتباه است."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(
        "Google login error:",
        err
      );

      setError(
        err?.message ||
          "ورود با Google انجام نشد."
      );

      setGoogleLoading(false);
    }
  }

  return (
    <main
      className="auth-page"
      dir="rtl"
    >
      <div className="auth-background" />

      <section className="auth-card">

        <Link
          to="/"
          className="auth-back"
        >
          <ArrowLeft size={17} />
          بازگشت
        </Link>

        <div className="auth-logo">
          <Gamepad2 size={30} />
        </div>

        <span className="auth-label">
          RTX GAME / LOGIN
        </span>

        <h1>
          خوش برگشتی
        </h1>

        <p className="auth-description">
          وارد حساب RTX GAME خودت شو.
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleLogin}
          disabled={
            loading || googleLoading
          }
        >
         <span className="google-g">
  G
</span>

          {googleLoading
            ? "در حال اتصال..."
            : "ورود با Google"}
        </button>

        <div className="auth-divider">
          <span>یا ورود با ایمیل</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          <label>
            ایمیل
          </label>

          <div className="input-wrapper">

            <Mail size={18} />

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="example@email.com"
              autoComplete="email"
              disabled={loading}
            />

          </div>

          <label>
            رمز عبور
          </label>

          <div className="input-wrapper">

            <Lock size={18} />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="رمز عبور"
              autoComplete="current-password"
              disabled={loading}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              tabIndex="-1"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="auth-spinner" />
                در حال ورود...
              </>
            ) : (
              <>
                ورود به RTX GAME
                <ArrowLeft size={18} />
              </>
            )}
          </button>

        </form>

        <div className="auth-footer">
          حساب نداری؟

          <Link to="/register">
            ساخت حساب جدید
          </Link>
        </div>

      </section>
    </main>
  );
}