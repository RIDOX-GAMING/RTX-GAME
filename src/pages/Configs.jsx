import { useState } from "react";
import {
  Copy,
  Check,
  Download,
  LockKeyhole,
  Timer,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import "./Configs.css";

export default function Configs() {
  const [config, setConfig] = useState("");
  const [claimedAt, setClaimedAt] = useState("");
  const [nextClaimAt, setNextClaimAt] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  async function claimConfig() {
    if (loading) return;

    setLoading(true);
    setMessage("");
    setCopied(false);

    try {
      const {
        data,
        error,
      } = await supabase.rpc(
        "claim_weekly_config"
      );

      if (error) {
        throw error;
      }

      const result =
        Array.isArray(data)
          ? data[0]
          : data;

      if (!result) {
        throw new Error(
          "پاسخ نامعتبر از سرور."
        );
      }

      if (!result.allowed) {
        setConfig("");

        if (result.claimed_at) {
          setClaimedAt(
            result.claimed_at
          );
        }

        if (result.next_claim_at) {
          setNextClaimAt(
            result.next_claim_at
          );
        }

        setMessage(
          "این هفته قبلاً کانفیگ خودت را دریافت کرده‌ای."
        );

        return;
      }

      setConfig(result.config || "");

      setClaimedAt(
        result.claimed_at || ""
      );

      setNextClaimAt(
        result.next_claim_at || ""
      );

      setMessage(
        "کانفیگ این هفته با موفقیت فعال شد."
      );
    } catch (error) {
      console.error(
        "Weekly config error:",
        error
      );

      setMessage(
        "دریافت کانفیگ انجام نشد. دوباره تلاش کن."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyConfig() {
    if (!config) return;

    try {
      await navigator.clipboard.writeText(
        config
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error(
        "Config copy error:",
        error
      );
    }
  }

  function formatDate(value) {
    if (!value) return "";

    return new Date(value).toLocaleString(
      "fa-IR",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  }

  return (
    <main
      className="configs-page"
      dir="rtl"
    >
      <div className="configs-background" />

      <section className="configs-hero">

        <div className="configs-icon">
          <ShieldCheck size={35} />
        </div>

        <span className="configs-label">
          RTX GAME / WEEKLY CONFIG
        </span>

        <h1>
          کانفیگ هفتگی
        </h1>

        <p>
          هر کاربر در هر هفته یک بار
          می‌تواند کانفیگ فعال را دریافت کند.
        </p>

      </section>

      <section className="configs-card">

        <div className="configs-top">

          <div>
            <span>
              CURRENT RELEASE
            </span>

            <h2>
              RTX GAME Config
            </h2>
          </div>

          <div className="configs-badge">
            <LockKeyhole size={15} />
            یک بار در هفته
          </div>

        </div>

        <div className="configs-info-grid">

          <div className="configs-info">
            <Timer size={17} />

            <div>
              <strong>
                محدودیت دریافت
              </strong>

              <span>
                هر کاربر هفته‌ای یک دریافت
              </span>
            </div>
          </div>

          <div className="configs-info">
            <Download size={17} />

            <div>
              <strong>
                نوع
              </strong>

              <span>
                VLESS / Reality
              </span>
            </div>
          </div>

        </div>

        <button
          type="button"
          className="configs-claim"
          onClick={claimConfig}
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle className="configs-spin" />
              در حال بررسی...
            </>
          ) : (
            <>
              <Download size={18} />
              دریافت کانفیگ این هفته
            </>
          )}
        </button>

        {message && (
          <div
            className={`configs-message ${
              config
                ? "success"
                : "warning"
            }`}
          >
            {message}
          </div>
        )}

        {config && (
          <div className="config-result">

            <div className="config-result-head">
              <div>
                <span>
                  YOUR WEEKLY CONFIG
                </span>

                <h3>
                  کانفیگ فعال
                </h3>
              </div>

              <button
                type="button"
                onClick={copyConfig}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    کپی شد
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    کپی
                  </>
                )}
              </button>
            </div>

            <textarea
              value={config}
              readOnly
              spellCheck="false"
            />

            <div className="config-dates">
              {claimedAt && (
                <span>
                  دریافت:
                  {" "}
                  {formatDate(
                    claimedAt
                  )}
                </span>
              )}

              {nextClaimAt && (
                <span>
                  دریافت بعدی:
                  {" "}
                  {formatDate(
                    nextClaimAt
                  )}
                </span>
              )}
            </div>

          </div>
        )}

        {!config &&
          nextClaimAt && (
            <div className="configs-next">
              <Timer size={17} />

              دریافت بعدی شما:
              {" "}
              <strong>
                {formatDate(
                  nextClaimAt
                )}
              </strong>
            </div>
          )}

      </section>
    </main>
  );
}