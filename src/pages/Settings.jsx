import { useState } from "react";

import {
  ChevronDown,
  Gamepad2,
  Zap,
  Mouse,
  Monitor,
  Wrench,
  Headphones,
  Globe,
} from "lucide-react";

import "./Settings.css";

const games = [
  {
    id: "cs2",
    name: "Counter-Strike 2",
    short: "CS2",

    sections: [
      {
        title: "تنظیمات افزایش FPS",
        icon: <Zap size={19} />,

        text:
          "برای داشتن FPS پایدار در Counter-Strike 2، ابتدا تنظیمات گرافیکی سنگین را بررسی کن. گزینه‌هایی مثل کیفیت سایه‌ها، Ambient Occlusion و بعضی افکت‌های تصویری می‌توانند روی عملکرد تأثیر بگذارند. بهتر است تنظیمات را بر اساس توان سیستم و FPS هدف خودت تنظیم کنی.",
      },

      {
        title: "تنظیمات Mouse و Sensitivity",
        icon: <Mouse size={19} />,

        text:
          "Sensitivity مناسب به سبک بازی و عادت شخصی بستگی دارد. بهتر است یک مقدار ثابت انتخاب کنی و دائماً آن را تغییر ندهی تا کنترل موس و Muscle Memory بهتری داشته باشی. همچنین تنظیمات Mouse ویندوز و بازی را به شکل سازگار تنظیم کن.",
      },

      {
        title: "تنظیمات گرافیکی و تصویر",
        icon: <Monitor size={19} />,

        text:
          "رزولوشن، Aspect Ratio و حالت نمایش را متناسب با مانیتورت انتخاب کن. اگر اولویتت بازی رقابتی است، تنظیماتی را انتخاب کن که در کنار تصویر واضح، FPS پایدار و تأخیر پایین داشته باشند.",
      },

      {
        title: "ViewModel و کنسول",
        icon: <Wrench size={20} />,

        text:
          " می‌شود، کنسول باز خواهد شد. بعد از باز شدن کنسول می‌توانی دستورات ViewModel viewmodel_offset_x 3 viewmodel_offset_z 2viewmodel_offset_y 2 میتونی با این دستورات امتحان کنی ببینی کدوم مدنظرته.",
      },

      {
        title: "Launch Options",
        icon: <Wrench size={19} />,

        text:
          "Launch Options از طریق Steam قابل تنظیم است. روی Counter-Strike 2 در Library کلیک راست کن، وارد Properties شو و بخش Launch Options را بررسی کن. فقط گزینه‌هایی را استفاده کن که کاربردشان را می‌دانی؛ اضافه کردن دستورات نامعتبر یا قدیمی لزوماً باعث بهتر شدن عملکرد نمی‌شود.",
      },

      {
        title: "تنظیمات صدا",
        icon: <Headphones size={19} />,

        text:
          "برای بازی رقابتی، صدای محیط و صداهای مهم بازی باید واضح باشند. صدای موسیقی و موارد غیرضروری را طوری تنظیم کن که مزاحم شنیدن صداهای مهم نشوند. استفاده از هدفون مناسب نیز می‌تواند تشخیص جهت صدا را راحت‌تر کند.",
      },

      {
        title: "تنظیمات Network",
        icon: <Globe size={19} />,

        text:
          "برای اتصال پایدار، از اینترنتی استفاده کن که نوسان کمی داشته باشد. هنگام بازی دانلودهای سنگین، آپلودهای غیرضروری و برنامه‌هایی که پهنای باند زیادی مصرف می‌کنند را محدود کن. تغییر DNS نیز در همه شرایط باعث کاهش Ping نمی‌شود.",
      },

      {
        title: "بهینه‌سازی سیستم",
        icon: <Wrench size={19} />,

        text:
          "قبل از اجرای بازی برنامه‌های غیرضروری را ببند و مطمئن شو درایور کارت گرافیک و سیستم‌عامل در وضعیت مناسبی هستند. بهتر است برنامه‌هایی که مصرف CPU، RAM یا GPU زیادی دارند هنگام بازی بسته یا محدود شوند.",
      },
    ],
  },

  {
    id: "r6",
    name: "Rainbow Six Siege",
    short: "R6",

    sections: [
      {
        title: "تنظیمات FPS",
        icon: <Zap size={19} />,

        text:
          "برای FPS پایدار، ابتدا کیفیت سایه‌ها، Reflection و گزینه‌های سنگین گرافیکی را بررسی کن. تنظیمات را بر اساس توان سیستم و نرخ فریم مورد نظرت انتخاب کن.",
      },

      {
        title: "Mouse و Sensitivity",
        icon: <Mouse size={19} />,

        text:
          "Sensitivity مناسب کاملاً به سبک بازی و عادت شخصی بستگی دارد. یک مقدار ثابت انتخاب کن و با تمرین به آن عادت کن.",
      },

      {
        title: "تنظیمات تصویر",
        icon: <Monitor size={19} />,

        text:
          "رزولوشن و تنظیمات تصویر را بر اساس مانیتور و توان سیستم انتخاب کن. هدف اصلی باید داشتن تصویر واضح و FPS پایدار باشد.",
      },

      {
        title: "تنظیمات صدا",
        icon: <Headphones size={19} />,

        text:
          "تنظیمات صدای مناسب می‌تواند تشخیص جهت صدا را راحت‌تر کند. صدای اضافی را تا حد امکان کاهش بده تا صداهای مهم محیطی واضح‌تر شنیده شوند.",
      },

      {
        title: "بهینه‌سازی",
        icon: <Wrench size={19} />,

        text:
          "قبل از اجرای بازی برنامه‌های غیرضروری را ببند و مطمئن شو سیستم منابع کافی برای اجرای بازی دارد.",
      },
    ],
  },

  {
    id: "phasmophobia",
    name: "Phasmophobia",
    short: "PHASMOPHOBIA",

    sections: [
      {
        title: "تنظیمات گرافیکی",
        icon: <Monitor size={19} />,

        text:
          "اگر با افت FPS مواجه شدی، ابتدا کیفیت Shadow و گزینه‌های پردازشی سنگین را کاهش بده. سپس تنظیمات را یکی‌یکی بررسی کن تا تعادل مناسبی بین کیفیت تصویر و عملکرد پیدا کنی.",
      },

      {
        title: "تنظیمات صدا",
        icon: <Headphones size={19} />,

        text:
          "برای تجربه بهتر بازی، صدای محیط و صداهای مربوط به تجهیزات را واضح نگه دار. صدای موسیقی و موارد غیرضروری را در حد مناسب قرار بده.",
      },

      {
        title: "بهینه‌سازی",
        icon: <Wrench size={19} />,

        text:
          "بستن برنامه‌های غیرضروری قبل از اجرای بازی می‌تواند به آزاد شدن منابع سیستم کمک کند.",
      },
    ],
  },

  {
    id: "rust",
    name: "Rust",
    short: "RUST",

    sections: [
      {
        title: "تنظیمات افزایش FPS",
        icon: <Zap size={19} />,

        text:
          "Rust می‌تواند به منابع زیادی نیاز داشته باشد. تنظیمات گرافیکی را بر اساس FPS هدف خودت تنظیم کن و در صورت نیاز گزینه‌های سنگین را کاهش بده.",
      },

      {
        title: "تنظیمات گرافیکی",
        icon: <Monitor size={19} />,

        text:
          "کیفیت Shadow، Draw Distance و افکت‌های سنگین می‌توانند تأثیر قابل توجهی روی عملکرد داشته باشند. در صورت افت FPS، ابتدا این گزینه‌ها را بررسی کن.",
      },

      {
        title: "تنظیمات Network",
        icon: <Globe size={19} />,

        text:
          "اتصال پایدار برای تجربه بهتر Rust اهمیت زیادی دارد. هنگام بازی از دانلودهای سنگین و فعالیت‌هایی که پهنای باند زیادی مصرف می‌کنند خودداری کن.",
      },

      {
        title: "بهینه‌سازی",
        icon: <Wrench size={19} />,

        text:
          "برنامه‌های غیرضروری را ببند و مطمئن شو فضای کافی و منابع مناسب برای اجرای بازی در دسترس هستند.",
      },
    ],
  },
];

function SettingItem({
  section,
  isOpen,
  onClick,
}) {
  return (
    <div
      className={`setting-item ${
        isOpen ? "open" : ""
      }`}
    >
      <button
        type="button"
        className="setting-header"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="setting-icon">
          {section.icon}
        </span>

        <span className="setting-title">
          {section.title}
        </span>

        <ChevronDown
          size={19}
          className="setting-chevron"
        />
      </button>

      <div className="setting-content">
        <div className="setting-content-inner">
          {section.text}
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const [selectedGame, setSelectedGame] =
    useState(games[0]);

  const [openIndex, setOpenIndex] =
    useState(null);

  function selectGame(game) {
    setSelectedGame(game);
    setOpenIndex(null);
  }

  function toggleSection(index) {
    setOpenIndex((current) =>
      current === index
        ? null
        : index
    );
  }

  return (
    <main
      className="settings-page"
      dir="rtl"
    >
      <div className="settings-background" />

      <section className="settings-hero">

        <div className="settings-hero-icon">
          <Gamepad2 size={34} />
        </div>

        <span className="settings-label">
          RTX GAME / SETTINGS
        </span>

        <h1>
          تنظیمات گیم مورد نظر
        </h1>

        <p>
          بازی مورد نظرت را انتخاب کن و
          نکات و تنظیمات کاربردی آن را ببین.
        </p>

      </section>

      <section className="games-selector">

        {games.map((game) => (
          <button
            key={game.id}
            type="button"
            className={`game-selector ${
              selectedGame.id === game.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              selectGame(game)
            }
          >
            <Gamepad2 size={18} />

            <span>
              {game.name}
            </span>
          </button>
        ))}

      </section>

      <section className="settings-content">

        <div className="selected-game">

          <div className="selected-game-icon">
            <Gamepad2 size={25} />
          </div>

          <div>
            <span>
              GAME SETTINGS
            </span>

            <h2>
              {selectedGame.name}
            </h2>
          </div>

        </div>

        <div className="settings-list">

          {selectedGame.sections.map(
            (section, index) => (
              <SettingItem
                key={`${selectedGame.id}-${index}`}
                section={section}
                isOpen={
                  openIndex === index
                }
                onClick={() =>
                  toggleSection(index)
                }
              />
            )
          )}

        </div>

      </section>
    </main>
  );
}