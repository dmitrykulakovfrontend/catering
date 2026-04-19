import { ImageResponse } from "next/og";

export const alt = "Любимый Кейтеринг — Кейтеринг в Москве";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(file: string): Promise<ArrayBuffer> {
  const url = `https://cdn.jsdelivr.net/npm/@fontsource/${file}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font fetch failed: ${file}`);
  return res.arrayBuffer();
}

export default async function Image() {
  const [playfair, inter] = await Promise.all([
    loadFont("playfair-display@latest/files/playfair-display-cyrillic-700-normal.woff"),
    loadFont("inter@latest/files/inter-cyrillic-500-normal.woff"),
  ]);

  const stats = [
    { value: "500+", label: "мероприятий" },
    { value: "50 000+", label: "гостей" },
    { value: "600+", label: "блюд" },
    { value: "10 лет", label: "на рынке" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #111827 0%, #1F2937 60%, #312E81 100%)",
          color: "white",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Кейтеринг в Москве · 10 лет опыта
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Playfair",
              fontSize: 110,
              lineHeight: 1.05,
              fontWeight: 700,
              maxWidth: 1000,
            }}
          >
            Любимый кейтеринг
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "rgba(255,255,255,0.8)",
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            Банкеты, фуршеты, корпоративы и свадьбы. Авторское меню и сервис
            под ключ.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 48,
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: 32,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: "Playfair",
                  fontSize: 44,
                  fontWeight: 700,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  color: "rgba(255,255,255,0.55)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair", data: playfair, style: "normal", weight: 700 },
        { name: "Inter", data: inter, style: "normal", weight: 500 },
      ],
    }
  );
}
