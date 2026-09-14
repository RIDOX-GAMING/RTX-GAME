import {
  Check,
  Copy,
  Globe,
  ShieldCheck,
  Zap,
  Wifi,
  Activity,
} from "lucide-react";
import { useState } from "react";

import "./DNS.css";

const dnsList = [
  {
    name: "Cloudflare",
    subtitle: "DNS سریع و امن",
    primary: "1.1.1.1",
    secondary: "1.0.0.1",
    badge: "پیشنهادی",
    accent: "cloudflare",
  },
  {
    name: "Google DNS",
    subtitle: "Google Public DNS",
    primary: "8.8.8.8",
    secondary: "8.8.4.4",
    badge: "پایدار",
    accent: "google",
  },
];

function DnsCard({ dns }) {
  const [copied, setCopied] = useState("");

  async function copyDns(value) {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(value);

      setTimeout(() => {
        setCopied("");
      }, 1600);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  return (
    <article className={`dns-card ${dns.accent}`}>
      <div className="dns-card-line" />

      <div className="dns-card-top">
        <div className="dns-icon">
          <Globe size={23} />
        </div>

        <div className="dns-title">
          <h2>{dns.name}</h2>
          <p>{dns.subtitle}</p>
        </div>

        <span className="dns-badge">
          {dns.badge}
        </span>
      </div>

      <div className="dns-status">
        <span className="dns-status-dot" />
        آماده استفاده
      </div>

      <div className="dns-addresses">
        <div className="dns-address">
          <div className="dns-address-info">
            <span>DNS اصلی</span>
            <strong>{dns.primary}</strong>
          </div>

          <button
            type="button"
            className={copied === dns.primary ? "copied" : ""}
            onClick={() => copyDns(dns.primary)}
            aria-label={`کپی ${dns.primary}`}
          >
            {copied === dns.primary ? (
              <Check size={17} />
            ) : (
              <Copy size={17} />
            )}

            <span>
              {copied === dns.primary ? "کپی شد" : "کپی"}
            </span>
          </button>
        </div>

        <div className="dns-address">
          <div className="dns-address-info">
            <span>DNS ثانویه</span>
            <strong>{dns.secondary}</strong>
          </div>

          <button
            type="button"
            className={copied === dns.secondary ? "copied" : ""}
            onClick={() => copyDns(dns.secondary)}
            aria-label={`کپی ${dns.secondary}`}
          >
            {copied === dns.secondary ? (
              <Check size={17} />
            ) : (
              <Copy size={17} />
            )}

            <span>
              {copied === dns.secondary ? "کپی شد" : "کپی"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function DNS() {
  return (
    <main className="dns-page" dir="rtl">
      <div className="dns-background" />
      <div className="dns-glow dns-glow-one" />
      <div className="dns-glow dns-glow-two" />

      <section className="dns-hero">
        <div className="dns-hero-icon">
          <Globe size={40} />
        </div>

        <span className="dns-label">
          RTX GAME / NETWORK
        </span>

        <h1>
          DNS مخصوص
          <span> گیمرها</span>
        </h1>

        <p>
          DNSهای شناخته‌شده و عمومی برای اتصال
          پایدارتر و تجربه بهتر در اینترنت.
        </p>

        <div className="dns-hero-stats">
          <div>
            <Wifi size={15} />
            <span>اتصال پایدار</span>
          </div>

          <div>
            <ShieldCheck size={15} />
            <span>امنیت بهتر</span>
          </div>

          <div>
            <Activity size={15} />
            <span>بررسی سریع</span>
          </div>
        </div>
      </section>

      <section className="dns-grid">
        {dnsList.map((dns) => (
          <DnsCard
            key={dns.name}
            dns={dns}
          />
        ))}

        <article className="dns-coming">
          <div className="dns-coming-icon">
            <Zap size={24} />
          </div>

          <div className="dns-coming-content">
            <span>COMING SOON</span>

            <h2>
              DNSهای بیشتر در راه هستند
            </h2>

            <p>
              سرویس‌های DNS بیشتری در آینده
              به RTX GAME اضافه خواهند شد.
            </p>
          </div>

          <div className="dns-coming-pulse" />
        </article>
      </section>

      <section className="dns-info">
        <div className="dns-info-icon">
          <ShieldCheck size={23} />
        </div>

        <div>
          <h3>
            یک نکته مهم درباره DNS
          </h3>

          <p>
            تغییر DNS همیشه باعث کاهش پینگ نمی‌شود.
            عملکرد DNS به سرویس‌دهنده اینترنت،
            موقعیت جغرافیایی و مسیر اتصال شما بستگی دارد.
          </p>
        </div>
      </section>
    </main>
  );
}

