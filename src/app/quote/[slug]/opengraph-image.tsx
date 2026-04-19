import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getQuoteBySlug } from "@/lib/queries";

export const alt = "Банкетное меню — Любимый Кейтеринг";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(file: string): Promise<ArrayBuffer> {
  const url = `https://cdn.jsdelivr.net/npm/@fontsource/${file}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font fetch failed: ${file}`);
  return res.arrayBuffer();
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quote = await getQuoteBySlug(slug);
  if (!quote) notFound();

  const [playfair, inter] = await Promise.all([
    loadFont("playfair-display@latest/files/playfair-display-cyrillic-700-normal.woff"),
    loadFont("inter@latest/files/inter-cyrillic-500-normal.woff"),
  ]);

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
            "linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #312E81 100%)",
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
            color: "rgba(255,255,255,0.65)",
          }}
        >
          Банкетное меню · Любимый Кейтеринг
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Playfair",
              fontSize: 96,
              lineHeight: 1.1,
              fontWeight: 700,
              maxWidth: 1040,
            }}
          >
            {quote.eventTitle}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "rgba(255,255,255,0.8)",
              gap: 24,
            }}
          >
            <span>{quote.persons} персон</span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>·</span>
            <span>{quote.eventTime}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: 28,
            fontSize: 22,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <span>Менеджер · {quote.managerName}</span>
          <span style={{ fontFamily: "Playfair", fontSize: 28 }}>
            Любимый Кейтеринг
          </span>
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
