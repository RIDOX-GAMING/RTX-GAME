import {
  ArrowLeft,
  Gamepad2,
  Globe,
  MessageCircle,
  Settings,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./Home.css";

export default function Home() {
  return (
    <main className="home-page" dir="rtl">
      <div className="home-grid" />

      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            <Zap size={15} />
            RTX GAME COMMUNITY
          </span>

          <h1>
            دنیای گیمینگ
            <br />
            <span>RTX GAME</span>
          </h1>

          <p>
            یک هاب گیمینگ برای گیمرها؛
            بازی‌ها، DNS، تنظیمات، چت
            و محتوای گیمینگ در یکجا.
          </p>

          <div className="hero-actions">
            <Link
              to="/games"
              className="hero-primary"
            >
              <Gamepad2 size={19} />
              مشاهده بازی‌ها
              <ArrowLeft size={17} />
            </Link>

            <Link
              to="/dns"
              className="hero-secondary"
            >
              <Globe size={18} />
              DNS گیمرها
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-ring ring-one" />
          <div className="hero-ring ring-two" />

          <div className="hero-controller">
            <Gamepad2 size={120} strokeWidth={1.1} />
          </div>

          <div className="floating-card card-one">
            <Gamepad2 size={19} />
            <div>
              <strong>Games</strong>
              <span>بازی‌های منتخب</span>
            </div>
          </div>

          <div className="floating-card card-two">
            <Globe size={19} />
            <div>
              <strong>DNS</strong>
              <span>اتصال بهتر</span>
            </div>
          </div>

          <div className="floating-card card-three">
            <MessageCircle size={19} />
            <div>
              <strong>Community</strong>
              <span>ارتباط گیمرها</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <FeatureCard
          icon={<Gamepad2 />}
          title="Games"
          text="معرفی و نمایش بازی‌های مختلف با تصویر و توضیحات."
          link="/games"
        />

        <FeatureCard
          icon={<Globe />}
          title="DNS"
          text="DNSهای کاربردی Cloudflare و Google برای گیمرها."
          link="/dns"
        />

        <FeatureCard
          icon={<MessageCircle />}
          title="Community Chat"
          text="چت عمومی مخصوص اعضای RTX GAME."
          link="/chat"
        />

        <FeatureCard
          icon={<Settings />}
          title="Game Settings"
          text="تنظیمات و آموزش‌های گیمینگ در یک بخش."
          link="/settings"
        />
      </section>

      <section className="home-telegram">
        <div>
          <span>
            RTX GAME OFFICIAL CHANNEL
          </span>

          <h2>
            همراه ما در تلگرام
          </h2>

          <p>
            اخبار، آپدیت‌ها و محتوای جدید
            RTX GAME را دنبال کن.
          </p>
        </div>

        <a
          href="https://t.me/RTX_GAME_ir"
          target="_blank"
          rel="noreferrer"
        >
          ورود به کانال
          <ArrowLeft size={18} />
        </a>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  text,
  link,
}) {
  return (
    <Link
      to={link}
      className="feature-card"
    >
      <div className="feature-icon">
        {icon}
      </div>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>

      <ArrowLeft
        className="feature-arrow"
        size={18}
      />
    </Link>
  );
}

