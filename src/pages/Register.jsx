
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  UserRound,
  Eye,
  EyeOff,
  ArrowLeft,
  Gamepad2,
  CheckCircle2,
} from "lucide-react";

import {
  registerUser,
} from "../services/auth";

import { supabase } from "../lib/supabase";

import "./Auth.css";


export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);


  function validate() {
    const cleanUsername = username.trim();

    if (cleanUsername.length < 3) {
      return "نام کاربری باید حداقل ۳ کاراکتر باشد.";
    }

    if (cleanUsername.length > 20) {
      return "نام کاربری نمی‌تواند بیشتر از ۲۰ کاراکتر باشد.";
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      return "نام کاربری فقط می‌تواند شامل حروف انگلیسی، عدد و _ باشد.";
    }

    if (!email.trim()) {
      return "ایمیل را وارد کنید.";
    }

    if (!password) {
      return "رمز عبور را وارد کنید.";
    }

    if (password.length < 8) {
      return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    }

    if (password !== passwordRepeat) {
      return "رمزهای عبور یکسان نیستند.";
    }

    return null;
  }


  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const cleanUsername = username
        .trim()
        .toLowerCase();

      const cleanEmail = email
        .trim()
        .toLowerCase();


      /*
       * قبل از ثبت‌نام بررسی می‌کنیم
       * Username قبلاً استفاده نشده باشد.
       */

      const { data: existingProfile, error: profileError } =
        await supabase
          .from("profiles")
          .select("id")
          .eq("username", cleanUsername)
          .maybeSingle();


      if (profileError) {
        throw profileError;
      }


      if (existingProfile) {
        setError(
          "این نام کاربری قبلاً استفاده شده است."
        );

        setLoading(false);
        return;
      }


      /*
       * ثبت‌نام در Supabase Auth
       */

      const data = await registerUser(
        cleanEmail,
        password
      );


      /*
       * اگر ایمیل نیاز به تأیید داشته باشد،
       * session معمولاً null خواهد بود.
       */

      if (!data?.user) {
        throw new Error(
          "ثبت‌نام انجام نشد."
        );
      }


      /*
       * اگر Supabase به‌خاطر تنظیمات پروژه
       * session ایجاد نکرد، منتظر تأیید ایمیل می‌مانیم.
       */

      if (!data.session) {
        setSuccess(true);
        setLoading(false);
        return;
      }


      /*
       * اگر Email Confirmation خاموش باشد،
       * پروفایل را همینجا می‌سازیم.
       */

      const { error: insertError } =
        await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            username: cleanUsername,
          });


      if (insertError) {
        throw insertError;
      }


      navigate("/");

    } catch (err) {

      console.error("Register error:", err);

      if (
        err?.message?.toLowerCase().includes(
          "already registered"
        )
      ) {
        setError(
          "این ایمیل قبلاً ثبت شده است."
        );
      } else {
        setError(
          err?.message ||
          "ثبت‌نام انجام نشد. دوباره تلاش کنید."
        );
      }

    } finally {
      setLoading(false);
    }
  }


  if (success) {
    return (
      <main
        className="auth-page"
        dir="rtl"
      >
        <div className="auth-background" />

        <section className="auth-card success-card">

          <div className="auth-logo">
            <Gamepad2 size={30} />
          </div>

          <CheckCircle2
            className="success-icon"
            size={58}
          />

          <span className="auth-label">
            RTX GAME / EMAIL
          </span>

          <h1>
            ایمیلت رو بررسی کن
          </h1>

          <p>
            لینک تأیید ثبت‌نام به ایمیل
            <strong>
              {" "}
              {email}
            </strong>
            {" "}
            ارسال شد.
          </p>

          <p className="auth-help">
            بعد از تأیید ایمیل، می‌توانی وارد
            حساب RTX GAME شوی.
          </p>

          <Link
            to="/login"
            className="auth-submit"
          >
            رفتن به صفحه ورود
            <ArrowLeft size={18} />
          </Link>

        </section>
      </main>
    );
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
          RTX GAME / REGISTER
        </span>


        <h1>
          ساخت حساب
        </h1>


        <p className="auth-description">
          به کامیونیتی RTX GAME خوش اومدی.
        </p>


        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          <label>
            نام کاربری
          </label>

          <div className="input-wrapper">

            <UserRound size={18} />

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="مثلاً RTX_Player"
              autoComplete="username"
              disabled={loading}
            />

          </div>


          <label>
            ایمیل
          </label>

          <div className="input-wrapper">

            <Mail size={18} />

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
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
                setPassword(event.target.value)
              }
              placeholder="حداقل ۸ کاراکتر"
              autoComplete="new-password"
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


          <label>
            تکرار رمز عبور
          </label>

          <div className="input-wrapper">

            <Lock size={18} />

            <input
              type={
                showRepeat
                  ? "text"
                  : "password"
              }
              value={passwordRepeat}
              onChange={(event) =>
                setPasswordRepeat(
                  event.target.value
                )
              }
              placeholder="رمز عبور را دوباره وارد کنید"
              autoComplete="new-password"
              disabled={loading}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowRepeat(
                  !showRepeat
                )
              }
              tabIndex="-1"
            >
              {showRepeat ? (
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
                در حال ساخت حساب...
              </>
            ) : (
              <>
                ساخت حساب RTX GAME
                <ArrowLeft size={18} />
              </>
            )}
          </button>

        </form>


        <div className="auth-footer">
          قبلاً حساب داری؟

          <Link to="/login">
            ورود به حساب
          </Link>
        </div>

      </section>

    </main>
  );
}

