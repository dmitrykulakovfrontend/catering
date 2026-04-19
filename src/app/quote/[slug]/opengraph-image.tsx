import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { getQuoteBySlug } from "@/lib/queries";

export const alt = "Банкетное меню — LoVely Catering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(file: string): Promise<ArrayBuffer> {
  const url = `https://cdn.jsdelivr.net/npm/@fontsource/${file}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font fetch failed: ${file}`);
  return res.arrayBuffer();
}

function formatValidUntil(date: Date): string {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quote = await getQuoteBySlug(slug);
  if (!quote) notFound();

  const [playfair, inter, logoBase64] = await Promise.all([
    loadFont("playfair-display@latest/files/playfair-display-cyrillic-700-normal.woff"),
    loadFont("inter@latest/files/inter-cyrillic-500-normal.woff"),
    readFile(join(process.cwd(), "public/logo-light.png"), "base64"),
  ]);
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  const validUntilText = quote.validUntil
    ? formatValidUntil(quote.validUntil)
    : null;

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
          <img src={logoSrc} height={100} alt="LoVely Catering" />
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
            Банкетное меню
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 26,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Playfair",
              fontSize: 88,
              lineHeight: 1.08,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              maxWidth: 1040,
            }}
          >
            {quote.eventTitle}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              fontSize: 32,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <span>{quote.persons} персон</span>
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                background: "#C8A96B",
                transform: "rotate(45deg)",
              }}
            />
            <span>{quote.eventTime}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(200,169,107,0.25)",
            paddingTop: 26,
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
              }}
            >
              Менеджер
            </div>
            <div style={{ display: "flex", fontSize: 24, color: "white" }}>
              {quote.managerName}
            </div>
          </div>

          {validUntilText && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                }}
              >
                Предложение действительно до
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Playfair",
                  fontSize: 28,
                  color: "#E8D5A8",
                  fontWeight: 700,
                }}
              >
                {validUntilText}
              </div>
            </div>
          )}
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
