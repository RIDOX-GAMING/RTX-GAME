import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Save,
  LogOut,
  RefreshCw,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import "./Profile.css";

const AVATARS = [
  "https://api.dicebear.com/9.x/bottts/svg?seed=RTX-01",
  "https://api.dicebear.com/9.x/bottts/svg?seed=RTX-02",
  "https://api.dicebear.com/9.x/bottts/svg?seed=RTX-03",
  "https://api.dicebear.com/9.x/bottts/svg?seed=RTX-04",
  "https://api.dicebear.com/9.x/bottts/svg?seed=RTX-05",
  "https://api.dicebear.com/9.x/bottts/svg?seed=RTX-06",
  "https://api.dicebear.com/9.x/bottts/svg?seed=RTX-07",
  "https://api.dicebear.com/9.x/bottts/svg?seed=RTX-08",
];

function randomAvatar() {
  return AVATARS[
    Math.floor(
      Math.random() * AVATARS.length
    )
  ];
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!currentUser) {
        window.location.href = "/login";
        return;
      }

      setUser(currentUser);

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select(
            "id, username, avatar, avatar_url"
          )
          .eq("id", currentUser.id)
          .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (profile) {
        setUsername(profile.username || "");

        setAvatar(
          profile.avatar_url ||
          profile.avatar ||
          randomAvatar()
        );
      } else {
        const newAvatar = randomAvatar();

        const defaultUsername =
          currentUser.user_metadata?.username ||
          currentUser.email?.split("@")[0] ||
          "RTX_User";

        const { error: insertError } =
          await supabase
            .from("profiles")
            .insert({
              id: currentUser.id,
              username: defaultUsername,
              avatar: newAvatar,
              avatar_url: newAvatar,
            });

        if (insertError) {
          throw insertError;
        }

        setUsername(defaultUsername);
        setAvatar(newAvatar);
      }
    } catch (err) {
      console.error(
        "Profile loading error:",
        err
      );

      setError(
        "دریافت اطلاعات پروفایل با مشکل مواجه شد."
      );
    } finally {
      setLoading(false);
    }
  }

  function changeAvatar() {
    const newAvatar = randomAvatar();

    setAvatar(newAvatar);
    setSaved(false);
  }

  async function saveProfile(event) {
    event.preventDefault();

    if (!user || saving) {
      return;
    }

    const cleanUsername =
      username.trim();

    if (cleanUsername.length < 3) {
      setError(
        "نام کاربری باید حداقل ۳ کاراکتر باشد."
      );
      return;
    }

    if (cleanUsername.length > 24) {
      setError(
        "نام کاربری نمی‌تواند بیشتر از ۲۴ کاراکتر باشد."
      );
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const { error: updateError } =
        await supabase
          .from("profiles")
          .update({
            username: cleanUsername,
            avatar: avatar,
            avatar_url: avatar,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      setUsername(cleanUsername);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      setError(
        "ذخیره پروفایل انجام نشد. دوباره تلاش کنید."
      );
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main
        className="profile-page"
        dir="rtl"
      >
        <div className="profile-loading">
          <LoaderCircle size={32} />

          <span>
            در حال بارگذاری پروفایل...
          </span>
        </div>
      </main>
    );
  }

  return (
    <main
      className="profile-page"
      dir="rtl"
    >
      <div className="profile-glow profile-glow-one" />
      <div className="profile-glow profile-glow-two" />

      <section className="profile-card">

        <header className="profile-header">

          <div className="profile-header-icon">
            <UserRound size={25} />
          </div>

          <div>
            <span>RTX GAME</span>
            <h1>پروفایل کاربری</h1>
          </div>

        </header>

        <div className="profile-body">

          {/* Avatar */}

          <div className="profile-avatar-section">

            <div className="profile-avatar">

              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                />
              ) : (
                <UserRound size={55} />
              )}

            </div>

            <button
              type="button"
              className="avatar-change-button"
              onClick={changeAvatar}
            >
              <RefreshCw size={15} />
              تغییر آواتار
            </button>

            <small>
              آواتار به‌صورت تصادفی انتخاب می‌شود
            </small>

          </div>

          {/* Form */}

          <form
            className="profile-form"
            onSubmit={saveProfile}
          >

            <div className="profile-field">

              <label>
                نام کاربری
              </label>

              <div className="profile-input">

                <UserRound size={17} />

                <input
                  type="text"
                  value={username}
                  onChange={(event) => {
                    setUsername(
                      event.target.value
                    );
                    setSaved(false);
                    setError("");
                  }}
                  maxLength={24}
                  placeholder="نام کاربری"
                  autoComplete="username"
                />

              </div>

            </div>

            <div className="profile-field">

              <label>
                ایمیل حساب
              </label>

              <div className="profile-input disabled">

                <Mail size={17} />

                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  readOnly
                />

              </div>

              <small>
                ایمیل از اطلاعات حساب شما دریافت می‌شود.
              </small>

            </div>

            {error && (
              <div className="profile-error">
                {error}
              </div>
            )}

            {saved && (
              <div className="profile-success">
                <CheckCircle2 size={17} />
                پروفایل با موفقیت ذخیره شد.
              </div>
            )}

            <button
              className="profile-save"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <>
                  <LoaderCircle className="profile-spin" />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <Save size={18} />
                  ذخیره تغییرات
                </>
              )}
            </button>

          </form>

        </div>

        {/* Account */}

        <footer className="profile-footer">

          <button
            type="button"
            className="profile-logout"
            onClick={logout}
          >
            <LogOut size={17} />
            خروج از حساب
          </button>

        </footer>

      </section>
    </main>
  );
}

