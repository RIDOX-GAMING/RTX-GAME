import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";

import {
  Gamepad2,
  Home as HomeIcon,
  UserRound,
  LogIn,
  LogOut,
  MessageCircle,
  Globe,
  Settings as SettingsIcon,
  Package,
  Send,
} from "lucide-react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import DNS from "./pages/DNS";
import Games from "./pages/Games";
import Settings from "./pages/Settings";

import { useAuth } from "./hooks/useAuth";
import { supabase } from "./lib/supabase";

import "./App.css";

/* =========================
   Protected Route
========================= */

function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="app-loading" dir="rtl">
        <div className="app-loading-icon">
          <Gamepad2 size={28} />
        </div>

        <span>در حال بارگذاری RTX GAME...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =========================
   Navbar
========================= */

function Navbar() {
  const location = useLocation();
  const { user, loading } = useAuth();

  const navItems = [
    {
      to: "/",
      label: "خانه",
      icon: <HomeIcon size={17} />,
    },
    {
      to: "/games",
      label: "بازی‌ها",
      icon: <Gamepad2 size={17} />,
    },
    {
      to: "/dns",
      label: "DNS",
      icon: <Globe size={17} />,
    },
    {
      to: "/chat",
      label: "چت",
      icon: <MessageCircle size={17} />,
      authOnly: true,
    },
    {
      to: "/settings",
      label: "تنظیمات گیم",
      icon: <SettingsIcon size={17} />,
    },
    {
      to: "/configs",
      label: "Configs",
      icon: <Package size={17} />,
    },
  ];

  const visibleItems = navItems.filter(
    (item) => !item.authOnly || user
  );

  async function logout() {
    try {
      await supabase.auth.signOut();
    } finally {
      window.location.href = "/";
    }
  }

  return (
    <header className="site-navbar">
      <div className="navbar-inner">

        {/* Brand */}

        <Link
          to="/"
          className="navbar-brand"
        >
          <div className="navbar-brand-icon">
            <Gamepad2 size={22} />
          </div>

          <div className="navbar-brand-text">
            <strong>RTX GAME</strong>
            <span>GAMING COMMUNITY</span>
          </div>
        </Link>

        {/* Navigation */}

        <nav className="main-nav">
          {visibleItems.map((item) => {
            const active =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link${active ? " active" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Account */}

        <div className="nav-account">

          {!loading && user ? (
            <>
              <Link
                to="/profile"
                className="profile-nav-button"
                title="پروفایل"
              >
                <UserRound size={18} />
                <span>پروفایل</span>
              </Link>

              <button
                type="button"
                className="logout-nav-button"
                onClick={logout}
                title="خروج"
              >
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="login-nav-button"
              >
                <LogIn size={17} />
                <span>ورود</span>
              </Link>

              <Link
                to="/register"
                className="register-nav-button"
              >
                ثبت‌نام
              </Link>
            </>
          )}

          <a
            href="https://t.me/RTX_GAME_ir"
            target="_blank"
            rel="noopener noreferrer"
            className="telegram-button"
            title="کانال تلگرام RTX GAME"
          >
            <Send size={16} />
          </a>

        </div>
      </div>
    </header>
  );
}

/* =========================
   Coming Soon
========================= */

function ComingSoon({ title, icon }) {
  return (
    <main
      className="coming-soon-page"
      dir="rtl"
    >
      <div className="coming-soon-card">

        <div className="coming-soon-icon">
          {icon || <Package size={40} />}
        </div>

        <span>RTX GAME</span>

        <h1>{title}</h1>

        <p>
          این بخش به‌زودی در RTX GAME فعال می‌شود.
        </p>

        <Link to="/">
          <HomeIcon size={17} />
          بازگشت به خانه
        </Link>

      </div>
    </main>
  );
}

/* =========================
   Routes
========================= */

function AppRoutes() {
  return (
    <Routes>

      {/* Home */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* Authentication */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Profile */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Games */}

      <Route
        path="/games"
        element={<Games />}
      />

      {/* DNS */}

      <Route
        path="/dns"
        element={<DNS />}
      />

      {/* Chat */}

      <Route
        path="/chat"
        element={<Chat />}
      />

      {/* Game Settings */}

      <Route
        path="/settings"
        element={<Settings />}
      />

      {/* Configs */}

      <Route
        path="/configs"
        element={
          <ComingSoon
            title="Free Configs"
            icon={<Package size={40} />}
          />
        }
      />

      {/* Old Home URL */}

      <Route
        path="/home"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

      {/* Unknown URL */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

/* =========================
   App
========================= */

export default function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <AppRoutes />

      <footer
        className="site-footer"
        dir="rtl"
      >
        <div className="footer-inner">

          <div className="footer-brand">

            <div className="footer-brand-icon">
              <Gamepad2 size={19} />
            </div>

            <div>
              <strong>RTX GAME</strong>
              <span>GAMING COMMUNITY</span>
            </div>

          </div>

          <div className="footer-copy">
            تمامی حقوق برای RTX GAME محفوظ است.
          </div>

          <a
            href="https://t.me/RTX_GAME_ir"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-telegram"
          >
            <Send size={15} />
            Telegram
          </a>

        </div>
      </footer>

    </BrowserRouter>
  );
}

