import { useState } from "react";
import {
  Copy,
  Check,
  Globe,
  Server,
} from "lucide-react";

import "./DNS.css";

const dnsServers = [
  {
    id: "vanilla",
    name: "Vanilla",
    description:
      "DNS Vanilla برای استفاده عمومی و اتصال پایدار.",
    primary: "194.146.68.68",
    secondary: "194.146.68.66",
  },
  {
    id: "uae",
    name: "UAE",
    description:
      "DNS سرورهای UAE برای تست مسیرهای مختلف اتصال.",
    primary: "2.10.148.72",
    secondary: "2.50.155.186",
  },
];

export default function DNS() {
  const [copied, setCopied] = useState("");

  async function copyDNS(value, id) {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(id);

      setTimeout(() => {
        setCopied("");
      }, 1800);
    } catch (error) {
      console.error(
        "DNS copy error:",
        error
      );
    }
  }

  return (
    <main
      className="dns-page"
      dir="rtl"
    >
      <div className="dns-background" />

      <section className="dns-hero">
        <div className="dns-hero-icon">
          <Globe size={34} />
        </div>

        <span className="dns-label">
          RTX GAME / NETWORK
        </span>

        <h1>
          DNSهای پیشنهادی
        </h1>

        <p>
          سرورهای DNS را امتحان کن و بر اساس
          کیفیت اتصال و مسیر شبکه خودت بهترین
          گزینه را انتخاب کن.
        </p>
      </section>

      <section className="dns-list">
        {dnsServers.map((dns) => (
          <article
            className="dns-card"
            key={dns.id}
          >
            <div className="dns-card-header">
              <div className="dns-card-icon">
                <Server size={22} />
              </div>

              <div>
                <span>RTX GAME DNS</span>
                <h2>{dns.name}</h2>
              </div>
            </div>

            <p className="dns-description">
              {dns.description}
            </p>

            <div className="dns-values">
              <DNSValue
                label="Primary"
                value={dns.primary}
                copied={
                  copied ===
                  `${dns.id}-primary`
                }
                onCopy={() =>
                  copyDNS(
                    dns.primary,
                    `${dns.id}-primary`
                  )
                }
              />

              <DNSValue
                label="Secondary"
                value={dns.secondary}
                copied={
                  copied ===
                  `${dns.id}-secondary`
                }
                onCopy={() =>
                  copyDNS(
                    dns.secondary,
                    `${dns.id}-secondary`
                  )
                }
              />
            </div>
          </article>
        ))}
      </section>

      <section className="dns-note">
        <Globe size={18} />

        <div>
          <strong>
            نکته مهم
          </strong>

          <p>
            تغییر DNS تضمین نمی‌کند که Ping
            همیشه کمتر شود. بهترین گزینه برای
            هر کاربر به ISP، موقعیت و مسیر شبکه
            بستگی دارد.
          </p>
        </div>
      </section>

      <section className="dns-more">
        <span>
          RTX GAME / MORE
        </span>

        <h2>
          DNSهای بیشتر به‌زودی
        </h2>

        <p>
          سرورهای بیشتری در آپدیت‌های بعدی
          اضافه خواهند شد.
        </p>
      </section>
    </main>
  );
}

function DNSValue({
  label,
  value,
  copied,
  onCopy,
}) {
  return (
    <div className="dns-value">
      <span>{label}</span>

      <div>
        <code>{value}</code>

        <button
          type="button"
          onClick={onCopy}
          title={
            copied
              ? "کپی شد"
              : "کپی"
          }
          aria-label={
            copied
              ? "کپی شد"
              : `کپی ${value}`
          }
        >
          {copied ? (
            <Check size={16} />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
    </div>
  );
}