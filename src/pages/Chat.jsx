import { useEffect, useRef, useState } from "react";
import {
  Send,
  MessageCircle,
  LoaderCircle,
  Trash2,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import "./Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function loadChat() {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!mounted) return;

        setUser(currentUser);

        if (!currentUser) {
          setLoading(false);
          return;
        }

        /* -----------------------------
           دریافت پیام‌ها
        ----------------------------- */

        const {
          data: messageData,
          error: messageError,
        } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", {
            ascending: true,
          });

        if (messageError) {
          console.error(
            "Chat messages error:",
            messageError
          );

          setLoading(false);
          return;
        }

        /* -----------------------------
           دریافت پروفایل کاربران
        ----------------------------- */

        const userIds = [
          ...new Set(
            (messageData || []).map(
              (message) => message.user_id
            )
          ),
        ];

        let profileMap = {};

        if (userIds.length > 0) {
          const {
            data: profiles,
            error: profilesError,
          } = await supabase
            .from("profiles")
            .select("id, username, avatar")
            .in("id", userIds);

          if (profilesError) {
            console.warn(
              "Profiles could not be loaded:",
              profilesError
            );
          }

          (profiles || []).forEach((profile) => {
            profileMap[profile.id] = profile;
          });
        }

        /* -----------------------------
           ترکیب پیام + پروفایل
        ----------------------------- */

        const formattedMessages = (
          messageData || []
        ).map((message) => {
          const profile =
            profileMap[message.user_id];

          return {
            ...message,

            username:
              profile?.username ||
              message.username ||
              currentUser?.user_metadata
                ?.username ||
              "کاربر",

            avatar:
              profile?.avatar ||
              message.avatar ||
              currentUser?.user_metadata
                ?.avatar_url ||
              null,
          };
        });

        if (mounted) {
          setMessages(formattedMessages);
        }

        setLoading(false);
      } catch (error) {
        console.error(
          "Chat initialization error:",
          error
        );

        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadChat();

    /* -----------------------------
       Realtime
    ----------------------------- */

    const channel = supabase
      .channel("rtx-game-public-chat")

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const message = payload.new;

          /* دریافت پروفایل فرستنده */

          const {
            data: profile,
            error,
          } = await supabase
            .from("profiles")
            .select("id, username, avatar")
            .eq("id", message.user_id)
            .maybeSingle();

          if (error) {
            console.warn(
              "Realtime profile error:",
              error
            );
          }

          const formattedMessage = {
            ...message,

            username:
              profile?.username ||
              message.username ||
              "کاربر",

            avatar:
              profile?.avatar ||
              message.avatar ||
              null,
          };

          setMessages((current) => {
            /* جلوگیری از دوبار نمایش دادن پیام */

            if (
              current.some(
                (item) =>
                  item.id ===
                  formattedMessage.id
              )
            ) {
              return current;
            }

            return [
              ...current,
              formattedMessage,
            ];
          });
        }
      )

      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          setMessages((current) =>
            current.filter(
              (message) =>
                message.id !== payload.old.id
            )
          );
        }
      )

      .subscribe((status) => {
        console.log(
          "Chat realtime status:",
          status
        );
      });

    return () => {
      mounted = false;

      supabase.removeChannel(channel);
    };
  }, []);

  /* -----------------------------
     اسکرول خودکار
  ----------------------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* -----------------------------
     ارسال پیام
  ----------------------------- */

  async function sendMessage(event) {
    event.preventDefault();

    const text = content.trim();

    if (!text || !user || sending) {
      return;
    }

    if (text.length > 500) {
      return;
    }

    setSending(true);

    try {
      /* دریافت پروفایل فعلی */

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("username, avatar")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.warn(
          "Current profile error:",
          profileError
        );
      }

      const username =
        profile?.username ||
        user.user_metadata?.username ||
        user.email?.split("@")[0] ||
        "کاربر";

      const avatar =
        profile?.avatar ||
        user.user_metadata?.avatar_url ||
        null;

      /* ارسال به Supabase */

      const {
        error: insertError,
      } = await supabase
        .from("messages")
        .insert({
          user_id: user.id,
          username,
          avatar,
          content: text,
        });

      if (insertError) {
        console.error(
          "Message send error:",
          insertError
        );

        return;
      }

      setContent("");
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );
    } finally {
      setSending(false);
    }
  }

  /* -----------------------------
     Loading
  ----------------------------- */

  if (loading) {
    return (
      <main
        className="chat-page"
        dir="rtl"
      >
        <div className="chat-loading">
          <LoaderCircle size={30} />

          <span>
            در حال بارگذاری چت...
          </span>
        </div>
      </main>
    );
  }

  /* -----------------------------
     کاربر لاگین نیست
  ----------------------------- */

  if (!user) {
    return (
      <main
        className="chat-page"
        dir="rtl"
      >
        <div className="chat-login-card">

          <div className="chat-login-icon">
            <MessageCircle size={38} />
          </div>

          <span>
            RTX GAME COMMUNITY
          </span>

          <h1>
            برای ورود به چت
            <br />
            ابتدا وارد حساب شوید
          </h1>

          <p>
            چت عمومی RTX GAME فقط برای
            کاربران ثبت‌نام‌شده فعال است.
          </p>

          <a href="/login">
            ورود به حساب
          </a>

        </div>
      </main>
    );
  }

  /* -----------------------------
     Chat
  ----------------------------- */

  return (
    <main
      className="chat-page"
      dir="rtl"
    >
      <div className="chat-bg-grid" />

      <section className="chat-container">

        {/* Header */}

        <header className="chat-header">

          <div className="chat-header-icon">
            <MessageCircle size={25} />
          </div>

          <div>
            <span>
              RTX GAME
            </span>

            <h1>
              چت عمومی
            </h1>
          </div>

          <div className="chat-online">
            <i />
            آنلاین
          </div>

        </header>

        {/* Notice */}

        <div className="chat-notice">
          <Trash2 size={15} />

          <span>
            پیام‌های این چت برای سبک‌تر ماندن
            سرویس، به‌صورت دوره‌ای پاک می‌شوند.
          </span>
        </div>

        {/* Messages */}

        <div className="chat-messages">

          {messages.length === 0 ? (
            <div className="chat-empty">

              <MessageCircle size={35} />

              <h3>
                هنوز پیامی ارسال نشده
              </h3>

              <p>
                اولین پیام را شما بفرستید!
              </p>

            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isMine={
                  message.user_id === user.id
                }
              />
            ))
          )}

          <div ref={messagesEndRef} />

        </div>

        {/* Input */}

        <form
          className="chat-input-area"
          onSubmit={sendMessage}
        >

          <div className="chat-input-wrap">

            <textarea
              value={content}
              onChange={(event) =>
                setContent(
                  event.target.value
                )
              }
              placeholder="پیامت رو بنویس..."
              maxLength={500}
              rows={1}
              disabled={sending}
              onKeyDown={(event) => {

                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  sendMessage(event);
                }

              }}
            />

            <span>
              {content.length}/500
            </span>

          </div>

          <button
            type="submit"
            disabled={
              sending ||
              !content.trim()
            }
            aria-label="ارسال پیام"
          >
            {sending ? (
              <LoaderCircle className="chat-spin" />
            ) : (
              <Send size={19} />
            )}
          </button>

        </form>

      </section>
    </main>
  );
}

/* =================================================
   پیام
================================================= */

function ChatMessage({
  message,
  isMine,
}) {
  const time = new Date(
    message.created_at
  ).toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const firstLetter =
    message.username
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "?";

  return (
    <article
      className={`chat-message ${
        isMine ? "mine" : ""
      }`}
    >

      {/* Avatar */}

      <div className="chat-avatar">

        {message.avatar ? (
          <img
            src={message.avatar}
            alt={message.username || "کاربر"}
            loading="lazy"
          />
        ) : (
          <span>
            {firstLetter}
          </span>
        )}

      </div>

      {/* Message */}

      <div className="chat-bubble-wrap">

        <div className="chat-meta">

          <strong>
            {message.username || "کاربر"}
          </strong>

          <time>
            {time}
          </time>

        </div>

        <div className="chat-bubble">
          {message.content}
        </div>

      </div>

    </article>
  );
}

