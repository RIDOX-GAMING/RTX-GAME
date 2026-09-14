import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Gamepad2,
  Search,
  Sparkles,
  LoaderCircle,
  ImageOff,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./Games.css";

const GAMES_FILE = "/games/games.json";

export default function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadGames() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${GAMES_FILE}?t=${Date.now()}`
        );

        if (!response.ok) {
          throw new Error(
            `games.json (${response.status})`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "games.json باید یک آرایه باشد."
          );
        }

        if (mounted) {
          setGames(data);
        }
      } catch (err) {
        console.error(
          "Games loading error:",
          err
        );

        if (mounted) {
          setError(
            "فایل بازی‌ها پیدا نشد یا ساختار آن صحیح نیست."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadGames();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredGames = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return games;
    }

    return games.filter((game) => {
      const title =
        String(game.title || "").toLowerCase();

      const genre =
        String(game.genre || "").toLowerCase();

      const description =
        String(game.description || "").toLowerCase();

      return (
        title.includes(query) ||
        genre.includes(query) ||
        description.includes(query)
      );
    });
  }, [games, search]);

  return (
    <main className="games-page" dir="rtl">
      <div className="games-grid-bg" />
      <div className="games-glow games-glow-one" />
      <div className="games-glow games-glow-two" />

      <section className="games-hero">
        <div className="games-hero-icon">
          <Gamepad2 size={40} />
        </div>

        <span className="games-label">
          RTX GAME / GAMES HUB
        </span>

        <h1>
          دنیای بازی‌های
          <span> RTX GAME</span>
        </h1>

        <p>
          بازی‌های منتخب را ببین، اطلاعاتشان را
          بررسی کن و وارد صفحه هر بازی شو.
        </p>

        <div className="games-toolbar">
          <div className="games-search">
            <Search size={18} />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="جستجوی بازی..."
              aria-label="جستجوی بازی"
            />

            {search && (
              <button
                type="button"
                className="games-search-clear"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="games-count">
            <Gamepad2 size={15} />
            {filteredGames.length} بازی
          </div>
        </div>
      </section>

      <section className="games-section">
        {loading && (
          <div className="games-state">
            <LoaderCircle className="games-spinner" size={32} />
            <span>
              در حال بارگذاری بازی‌ها...
            </span>
          </div>
        )}

        {!loading && error && (
          <div className="games-state games-error">
            <ImageOff size={34} />
            <h3>
              بازی‌ها بارگذاری نشدند
            </h3>
            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          filteredGames.length === 0 && (
            <div className="games-state">
              <Search size={34} />

              <h3>
                بازی‌ای پیدا نشد
              </h3>

              <p>
                عبارت دیگری برای جستجو امتحان کن.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredGames.length > 0 && (
            <div className="games-list">
              {filteredGames.map((game, index) => (
                <GameCard
                  key={
                    game.id ||
                    game.slug ||
                    `${game.title}-${index}`
                  }
                  game={game}
                />
              ))}
            </div>
          )}
      </section>

      <section className="games-coming">
        <div className="games-coming-icon">
          <Sparkles size={23} />
        </div>

        <div>
          <span>RTX GAME / NEXT</span>

          <h2>
            بازی‌های بیشتری در راه هستند
          </h2>

          <p>
            لیست بازی‌ها به مرور از طریق مخزن RTX GAME
            کامل‌تر می‌شود.
          </p>
        </div>
      </section>
    </main>
  );
}

function GameCard({ game }) {
  const image =
    game.image ||
    "/images/game-placeholder.svg";

  return (
    <Link
      to={`/games/${game.slug}`}
      className="game-card"
    >
      <div className="game-image-wrap">
        <img
          src={image}
          alt={game.title || "Game"}
          className="game-image"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src =
              "/images/game-placeholder.svg";
          }}
        />

        <div className="game-image-overlay" />

        {game.badge && (
          <span className="game-badge">
            {game.badge}
          </span>
        )}
      </div>

      <div className="game-card-content">
        <div className="game-meta">
          {game.genre && (
            <span>{game.genre}</span>
          )}

          {game.platform && (
            <span>{game.platform}</span>
          )}
        </div>

        <h2>
          {game.title || "بدون عنوان"}
        </h2>

        <p>
          {game.shortDescription ||
            game.description ||
            "توضیحاتی برای این بازی ثبت نشده است."}
        </p>

        <div className="game-card-footer">
          <span>
            مشاهده بازی
          </span>

          <ArrowLeft size={17} />
        </div>
      </div>
    </Link>
  );
}

