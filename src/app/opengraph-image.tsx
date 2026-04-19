import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "LoVely Catering — Кейтеринг в Москве";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(file: string): Promise<ArrayBuffer> {
  const url = `https://cdn.jsdelivr.net/npm/@fontsource/${file}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font fetch failed: ${file}`);
  return res.arrayBuffer();
}

export default async function Image() {
  const [playfair, inter, logoBase64] = await Promise.all([
    loadFont("playfair-display@latest/files/playfair-display-cyrillic-700-normal.woff"),
    loadFont("inter@latest/files/inter-cyrillic-500-normal.woff"),
    readFile(join(process.cwd(), "public/logo-light.png"), "base64"),
  ]);
  const logoSrc = `data:image/png;base64,${logoBase64}`;

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
          padding: "72px 80px",
          background:
            "radial-gradient(130% 95% at 18% 8%, #1E3FCC 0%, #162E99 40%, #0F1F66 100%)",
          color: "white",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(200,169,107,0.10) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            opacity: 0.45,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} height={120} alt="LoVely Catering" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 20,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#D4B896",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                background: "#C8A96B",
                transform: "rotate(45deg)",
              }}
            />
            Кейтеринг в Москве
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Playfair",
              fontSize: 120,
              lineHeight: 1.0,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            LoVely Catering
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", width: 56, height: 2, background: "#C8A96B" }} />
            <div
              style={{
                display: "flex",
                fontSize: 30,
                color: "rgba(255,255,255,0.82)",
                maxWidth: 900,
                lineHeight: 1.35,
              }}
            >
              Банкеты · Фуршеты · Корпоративы · Свадьбы
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 48,
            borderTop: "1px solid rgba(200,169,107,0.25)",
            paddingTop: 28,
            zIndex: 1,
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
                  color: "#E8D5A8",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 16,
                  color: "rgba(255,255,255,0.55)",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  marginTop: 6,
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
