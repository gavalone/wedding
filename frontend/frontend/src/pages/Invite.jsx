import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import "./invite.css";

/* Разбросанные instax-фото молодожёнов */
const SIDE_PHOTOS = [
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/1.jpg",  side: "left",  top: "2%",  offset: 14, rotate: -8 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/2.jpg",  side: "right", top: "6%",  offset: 24, rotate: 7 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/3.jpg",  side: "left",  top: "20%", offset: 34, rotate: 5 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/4.jpg",  side: "right", top: "24%", offset: 10, rotate: -9 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/5.jpg",  side: "left",  top: "38%", offset: 8,  rotate: -4 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/6.jpg",  side: "right", top: "42%", offset: 30, rotate: 9 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/7.jpg",  side: "left",  top: "56%", offset: 22, rotate: 8 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/8.jpg",  side: "right", top: "60%", offset: 14, rotate: -6 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/9.jpg",  side: "left",  top: "74%", offset: 30, rotate: -7 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/10.jpg", side: "right", top: "78%", offset: 10, rotate: 5 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/11.jpg", side: "left",  top: "83%", offset: 18, rotate: 6 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/12.jpg", side: "right", top: "87%", offset: 26, rotate: -8 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/13.jpg", side: "left",  top: "92%", offset: 12, rotate: 3 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/14.jpg", side: "right", top: "96%", offset: 20, rotate: -4 },
];

/* Мемы */
const MEME_PHOTOS = [
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/mem1.jpg", side: "left",  top: "11%", offset: 50, rotate: -16 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/mem2.jpg", side: "right", top: "15%", offset: 6,  rotate: 14 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/mem3.jpg", side: "left",  top: "29%", offset: 4,  rotate: 18 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/mem4.jpg", side: "right", top: "33%", offset: 46, rotate: -12 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/mem5.jpg", side: "left",  top: "47%", offset: 40, rotate: 10 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/mem6.jpg", side: "right", top: "51%", offset: 16, rotate: -18 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/mem7.jpg", side: "left",  top: "65%", offset: 26, rotate: 12 },
  { src: "https://9si3yrtcvfypccik.public.blob.vercel-storage.com/mem8.jpg", side: "right", top: "69%", offset: 44, rotate: -10 },
];

const DEFAULT_MENU = [
  {
    category: "Холодные закуски",
    items: [
      {
        name: "Мясное плато",
        description: "окорок тамбовский, пастрами, куриный рулет, язык говяжий, хрен, горчица, укроп",
      },
      {
        name: "Домашние соленья",
        description: "чеснок маринованный, квашеная капуста, огурцы солёные, огурцы и помидоры малосольные, патиссоны, черемша",
      },
      {
        name: "Слабосоленая сельдь с картофелем",
        description: "слабосоленая сельдь, картофель отварной, лук белый маринованный, зелень",
      },
      {
        name: "Сырная тарелка",
        description: "раклет, кабралес, качотта, раннителлер, виноград, мёд, грецкий орех, мята",
      },
    ],
  },
  {
    category: "Хлеб / Фокачча",
    items: [
      { name: "Фокачча ассорти", description: "мука, вода, розмарин" },
      { name: "Хлебная корзина", description: "5 видов хлеба + масло" },
    ],
  },
  {
    category: "Десерты",
    items: [
      { name: "Фруктовая тарелка", description: "тарелка с сезонными фруктами и ягодами" },
      { name: "Торт 'Медовик'", description: "торт, приготовленный мамой Инной" },
    ],
  },
];

const DEFAULT_BAR = [
  {
    category: "Минеральная вода",
    items: [
      { name: "Малгре", description: "газ / без газа" },
    ],
  },
  {
    category: "Газированные напитки",
    items: [
      { name: "Coca cola" },
    ],
  },
  {
    category: "Соки / Морсы / Лимонады / Чаи",
    items: [
      { name: "Арбуз-Малина" },
      { name: "Манго-Маракуйя" },
      { name: "Гуава-Грейпфрут" },
      { name: "Юдзу-Лемонграсс" },
      { name: "Тархун-Фейгуа" },
    ],
  },
];

export default function Invite() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [started, setStarted] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/api/guest/${token}`)
      .then(res => {
        console.log("API response:", res.data);

        if (!res.data || !res.data.event) {
          console.error("Invalid guest data", res.data);
          return;
        }

        setData(res.data);
      })
      .catch(err => {
        console.error("API error:", err);
        setData(null);
      });
  }, [token]);

  useEffect(() => {
    if (data) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      const t = setTimeout(() => setOpened(true), 5000);
      return () => clearTimeout(t);
    }
  }, [data]);

  useEffect(() => {
    const target = new Date("2026-07-04T19:00:00");
    const tick = () => {
      const diff = target - new Date();
      if (diff <= 0) {
        setStarted(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="page-bg h-screen flex items-center justify-center">
        <p className="font-body italic text-[var(--muted)] text-lg animate-pulse">
          Открываем приглашение…
        </p>
      </div>
    );
  }

  return (
    <div className="page-bg min-h-screen font-body text-[var(--ink)]">

      {!opened ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-screen flex flex-col items-center justify-center px-6"
        >
          <motion.div
            initial={{ y: 16, opacity: 0, rotate: -2 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-[var(--cream)] rounded-[28px] shadow-2xl px-10 py-12 text-center max-w-sm border border-[var(--gold)]/30"
          >
            <h1 className="font-display text-2xl text-[var(--ink)] font-bold heading-line">
              Вам приглашение!
            </h1>
            <p className="font-body text-sm text-[var(--muted)] mt-4">
              {data.name}, для вас забронировано место
            </p>
            <button
              onClick={() => setOpened(true)}
              className="open-ticket-btn"
            >
              Открыть
            </button>
          </motion.div>
        </motion.div>
      ) : (

        <div className="page-shell">

          {/* радуга*/}
          <div className="rainbow-decor" aria-hidden="true">
            <svg viewBox="0 0 400 200" className="rainbow-svg">
              <path d="M20,200 A180,180 0 0 1 380,200" stroke="#ff8a8a" strokeWidth="18" fill="none" strokeLinecap="round" />
              <path d="M38,200 A162,162 0 0 1 362,200" stroke="#ffb877" strokeWidth="18" fill="none" strokeLinecap="round" />
              <path d="M56,200 A144,144 0 0 1 344,200" stroke="#ffe27a" strokeWidth="18" fill="none" strokeLinecap="round" />
              <path d="M74,200 A126,126 0 0 1 326,200" stroke="#8fe0a0" strokeWidth="18" fill="none" strokeLinecap="round" />
              <path d="M92,200 A108,108 0 0 1 308,200" stroke="#7ec8f2" strokeWidth="18" fill="none" strokeLinecap="round" />
              <path d="M110,200 A90,90 0 0 1 290,200" stroke="#9aa3f5" strokeWidth="18" fill="none" strokeLinecap="round" />
              <path d="M128,200 A72,72 0 0 1 272,200" stroke="#d99af0" strokeWidth="18" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* фото молодеженов */}
          {SIDE_PHOTOS.map((p, i) => (
            <div
              key={i}
              className={`polaroid-photo polaroid-${p.side}`}
              style={{
                top: p.top,
                [p.side]: `${p.offset}px`,
                transform: `rotate(${p.rotate}deg)`,
              }}
            >
              <img src={p.src} alt="" className="polaroid-img" />
            </div>
          ))}

          {/* мемы */}
          {MEME_PHOTOS.map((m, i) => (
            <div
              key={i}
              className={`meme-sticker meme-${m.side}`}
              style={{
                top: m.top,
                [m.side]: `${m.offset}px`,
                transform: `rotate(${m.rotate}deg)`,
              }}
            >
              <img src={m.src} alt="" className="meme-img" />
            </div>
          ))}

          <div className="content-container py-14">

            {/* шапка */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center section-block"
            >
              <h1 className="font-display font-bold text-5xl sm:text-6xl mt-3 text-[var(--ink)] heading-line">
                {data.name}
              </h1>
              <p className="font-body text-[var(--muted)] mt-4">
                Вы приглашены на свадьбу
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative bg-[var(--cream)] rounded-[28px] shadow-xl px-7 py-8 sm:px-10 sm:py-10 section-block"
            >
              {/* таймер до свадьбы */}
              <div className="timer-container margin-bottom-40">
                <div className="timer-unit">
                  <span className="timer-value">
                    {started ? "—" : String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="timer-label">дней</span>
                </div>

                <div className="timer-unit">
                  <span className="timer-value">
                    {started ? "—" : String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="timer-label">часов</span>
                </div>

                <div className="timer-unit">
                  <span className="timer-value">
                    {started ? "—" : String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="timer-label">минут</span>
                </div>
              </div>

              {started && (
                <p className="text-center italic text-[var(--rose)] text-sm margin-bottom-40">
                  Праздник уже начался!
                </p>
              )}

              <div className="pt-7">

                {/* место проведения */}
                <h3 className="section-heading margin-bottom-40">
                  Место проведения
                </h3>

                <div className="text-center mb-6 text-[15px] leading-8 text-[var(--ink)]">
                  <p>{data?.event?.place}</p>
                  <a
                    href={`tel:${data.event.phone}`}
                    className="text-[var(--gold)] mt-2 inline-block"
                  >
                    {data.event.phone}
                  </a>
                </div>

                {/* карта */}
                <div className="map-wrapper margin-bottom-40">
                  <iframe
                    title="map"
                    width="100%"
                    height="240"
                    style={{ border: 0, display: "block" }}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      "Москва, ул. Большая Семеновская, 50"
                    )}&output=embed`}
                  />
                </div>

                {/* время */}
                <h3 className="section-heading margin-bottom-40">
                  Время
                </h3>

                <p className="text-center margin-bottom-40 text-[15px] leading-8 text-[var(--ink)]">
                  {data.event.time}
                </p>

                <div className="photo-note margin-bottom-40">
                  <p className="photo-note-text">
                    Снимайте все и много, каждый из вас станет первой страничкой
                    в нашем семейном альбоме!
                  </p>
                </div>

                <h3 className="section-heading mb-4">
                  Дресс-код
                </h3>

                <p className="text-center text-[15px] leading-8 text-[var(--ink)]">
                  {data.event.dresscode}
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
                  className="envelope-note margin-bottom-40"
                  style={{ marginTop: "40px" }}
                >
                  <p className="envelope-note-text">
                    Дорогие гости! Если хотите поздравить нас с днем рождения нашей семьи,
                    нам будет достаточно того, что Вы принесете в конвертах! К сожалению,
                    цветы, сладости и другие подарки нам будет потом очень неудобно транспортировать.
                    Спасибо за понимание и ждем вас и ваше хорошее настроение!
                  </p>
                </motion.div>

              </div>
            </motion.div>

            <div className="section-block">
              <SectionTitle title="Меню" />

              <div className="default-menu">
                {DEFAULT_MENU.map((cat, ci) => (
                  <div key={ci} className="default-menu-category">
                    <h4 className="default-menu-category-title">{cat.category}</h4>
                    <ul className="default-menu-items">
                      {cat.items.map((item, ii) => (
                        <li key={ii} className="default-menu-item">
                          <span className="default-menu-item-name">{item.name}</span>
                          {item.description && (
                            <span className="default-menu-item-desc"> — {item.description}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-block">

              <SectionTitle title="Индивидуальный предзаказ блюд" />

              <div className="dishes-grid">
                {Object.entries(data.dishes).map(([key, dish]) => (
                  <div key={key} className="dish-card">
                    <h3 className="dish-title">{dish.title}</h3>

                    <img
                      src={dish.image}
                      alt={dish.title}
                      className="dish-image"
                    />

                    <p className="dish-description">
                      {dish.description ? dish.description : " "}
                    </p>
                  </div>
                ))}
              </div>

            </div>

            <div className="section-block">
              <SectionTitle title="Бар" />

              <div className="default-menu">
                {DEFAULT_BAR.map((cat, ci) => (
                  <div key={ci} className="default-menu-category">
                    <h4 className="default-menu-category-title">{cat.category}</h4>
                    <ul className="default-menu-items">
                      {cat.items.map((item, ii) => (
                        <li key={ii} className="default-menu-item">
                          <span className="default-menu-item-name">{item.name}</span>
                          {item.description && (
                            <span className="default-menu-item-desc"> — {item.description}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-block text-center">
              <SectionTitle title="Индивидуальный предзаказ напитков" />

              <div className="flex justify-center gap-3 flex-wrap mt-6">
                {data.alcohol.map((a, i) => (
                  <span
                    key={i}
                    className="font-body text-sm bg-[var(--cream)] border border-[var(--gold)]/30 px-5 py-2 rounded-full shadow-sm"
                  >
                    {a?.title}
                  </span>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="thanks-note"
            >
              <p className="thanks-note-text">
                Все благодарности за тортик — маме жениха — Инне Анатольевне!
                Замечательной маме и не менее замечательному кондитеру!
              </p>
            </motion.div>

          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="text-center">
      <h2 className="section-heading">
        {title}
      </h2>
    </div>
  );
}