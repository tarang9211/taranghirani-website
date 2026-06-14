import satori from "satori";
import sharp from "sharp";
import * as fs from "fs/promises";
import * as path from "path";

const WIDTH = 1080;
const HEIGHT = 1350;

const C = {
  charcoal: "#080808",
  paper: "#F5F5F3",
  smoke: "#525252",
  sage: "#C4956A",
  white: "#FFFFFF",
};

const FONTS_DIR = path.join(process.cwd(), "node_modules");

async function loadFonts() {
  const [
    playfairBold,
    playfairBoldItalic,
    sourceSansRegular,
    sourceSansSemiBold,
    sourceSansBold,
  ] = await Promise.all([
    fs.readFile(
      path.join(
        FONTS_DIR,
        "@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff",
      ),
    ),
    fs.readFile(
      path.join(
        FONTS_DIR,
        "@fontsource/playfair-display/files/playfair-display-latin-700-italic.woff",
      ),
    ),
    fs.readFile(
      path.join(
        FONTS_DIR,
        "@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff",
      ),
    ),
    fs.readFile(
      path.join(
        FONTS_DIR,
        "@fontsource/source-sans-3/files/source-sans-3-latin-600-normal.woff",
      ),
    ),
    fs.readFile(
      path.join(
        FONTS_DIR,
        "@fontsource/source-sans-3/files/source-sans-3-latin-700-normal.woff",
      ),
    ),
  ]);

  return [
    {
      name: "Playfair Display",
      data: playfairBold.buffer as ArrayBuffer,
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Playfair Display",
      data: playfairBoldItalic.buffer as ArrayBuffer,
      weight: 700 as const,
      style: "italic" as const,
    },
    {
      name: "Source Sans 3",
      data: sourceSansRegular.buffer as ArrayBuffer,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Source Sans 3",
      data: sourceSansSemiBold.buffer as ArrayBuffer,
      weight: 600 as const,
      style: "normal" as const,
    },
    {
      name: "Source Sans 3",
      data: sourceSansBold.buffer as ArrayBuffer,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}

async function buildBackground(imagePath: string): Promise<Buffer> {
  const imgBuffer = await fs.readFile(imagePath);

  // Cover-fit the tiger into 1080x1350
  const cover = await sharp(imgBuffer)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();

  // Subtle vignette darken to give text breathing room
  const vignette = Buffer.from(
    `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="topShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(8,8,8,0.80)"/>
          <stop offset="14%" stop-color="rgba(8,8,8,0.45)"/>
          <stop offset="25%" stop-color="rgba(8,8,8,0.0)"/>
        </linearGradient>
        <linearGradient id="bottomShade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="rgba(8,8,8,0.92)"/>
          <stop offset="35%" stop-color="rgba(8,8,8,0.55)"/>
          <stop offset="55%" stop-color="rgba(8,8,8,0.0)"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#topShade)"/>
      <rect width="100%" height="100%" fill="url(#bottomShade)"/>
    </svg>`,
  );

  return sharp(cover)
    .composite([{ input: vignette, blend: "over" }])
    .png()
    .toBuffer();
}

async function buildOverlay(
  fonts: Awaited<ReturnType<typeof loadFonts>>,
): Promise<Buffer> {
  // No frame, no badge — text-only overlay
  const frameSvg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg"></svg>`;

  const overlay = {
    type: "div",
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column" as const,
        position: "relative" as const,
        fontFamily: "Source Sans 3",
      },
      children: [
        // ===== Top hook =====
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 80,
              left: 76,
              right: 76,
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              gap: 14,
            },
            children: [
              {
                type: "span",
                props: {
                  style: {
                    fontFamily: "Playfair Display",
                    fontWeight: 700,
                    fontStyle: "italic",
                    fontSize: 32,
                    color: C.white,
                    letterSpacing: 0.5,
                    textAlign: "center" as const,
                  },
                  children:
                    "Six safaris. One tiger reserve. Patience does the rest.",
                },
              },
              {
                type: "div",
                props: {
                  style: { width: 48, height: 1, backgroundColor: C.sage },
                },
              },
            ],
          },
        },

        // ===== Lower content block =====
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              left: 76,
              right: 76,
              bottom: 480,
              display: "flex",
              flexDirection: "column" as const,
              gap: 4,
            },
            children: [
              // Big headline
              {
                type: "span",
                props: {
                  style: {
                    fontFamily: "Playfair Display",
                    fontWeight: 700,
                    fontSize: 168,
                    color: C.white,
                    lineHeight: 1.0,
                    marginBottom: 6,
                  },
                  children: "Panna",
                },
              },
              // Subhead — italic serif
              {
                type: "span",
                props: {
                  style: {
                    fontFamily: "Playfair Display",
                    fontWeight: 700,
                    fontStyle: "italic",
                    fontSize: 32,
                    color: C.paper,
                    lineHeight: 1.2,
                    marginBottom: 18,
                  },
                  children: "A guided wildlife photography experience",
                },
              },
              // Date + Limited Seats
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "row" as const,
                    alignItems: "center",
                    gap: 18,
                  },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: {
                          fontFamily: "Source Sans 3",
                          fontWeight: 700,
                          fontSize: 28,
                          color: C.white,
                          letterSpacing: 4,
                        },
                        children: "OCT 21–25, 2026",
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: {
                          fontFamily: "Source Sans 3",
                          fontWeight: 400,
                          fontSize: 28,
                          color: C.sage,
                          letterSpacing: 4,
                        },
                        children: "·",
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: {
                          fontFamily: "Source Sans 3",
                          fontWeight: 700,
                          fontSize: 28,
                          color: C.sage,
                          letterSpacing: 4,
                        },
                        children: "LIMITED SEATS",
                      },
                    },
                  ],
                },
              },
              // Price + origin line
              {
                type: "span",
                props: {
                  style: {
                    fontFamily: "Source Sans 3",
                    fontWeight: 700,
                    fontSize: 28,
                    color: C.white,
                    letterSpacing: 4,
                    marginTop: 10,
                  },
                  children: "INR 84,999 / PERSON  ·  EX-GWALIOR (GWL)",
                },
              },
            ],
          },
        },

        // ===== Footer =====
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              left: 76,
              right: 76,
              bottom: 220,
              display: "flex",
              flexDirection: "column" as const,
              gap: 18,
            },
            children: [
              // Divider rule
              {
                type: "div",
                props: {
                  style: {
                    width: "100%",
                    height: 1,
                    backgroundColor: C.sage,
                    opacity: 0.7,
                  },
                },
              },
              // Primary CTA — phone + email
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: 4,
                  },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: {
                          fontFamily: "Source Sans 3",
                          fontWeight: 700,
                          fontSize: 30,
                          color: C.white,
                          letterSpacing: 2,
                        },
                        children: "Call +91 70300 47045",
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: {
                          fontFamily: "Source Sans 3",
                          fontWeight: 700,
                          fontSize: 30,
                          color: C.white,
                          letterSpacing: 2,
                        },
                        children:
                          "or email safaris@taranghirani.com to reserve",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };

  const textSvg = await satori(overlay as any, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });

  const textLayer = await sharp(Buffer.from(textSvg)).png().toBuffer();
  const frameLayer = await sharp(Buffer.from(frameSvg)).png().toBuffer();

  // Compose frame first (cut around badge area), then text (which paints the badge text)
  return sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: frameLayer, blend: "over" },
      { input: textLayer, blend: "over" },
    ])
    .png()
    .toBuffer();
}

async function main() {
  const imageArgIdx = process.argv.indexOf("--image");
  if (imageArgIdx === -1) {
    console.error("Usage: npm run panna-poster -- --image <path>");
    process.exit(1);
  }
  const imagePath = process.argv[imageArgIdx + 1];

  process.stdout.write("Loading fonts... ");
  const fonts = await loadFonts();
  console.log("done");

  process.stdout.write("Building background... ");
  const bg = await buildBackground(imagePath);
  console.log("done");

  process.stdout.write("Building overlay... ");
  const overlay = await buildOverlay(fonts);
  console.log("done");

  const finalBuffer = await sharp(bg)
    .composite([{ input: overlay, blend: "over" }])
    .jpeg({ quality: 95 })
    .toBuffer();

  const today = new Date().toISOString().slice(0, 10);
  const dir = path.join(
    process.cwd(),
    ".claude",
    "skills",
    "social-slide",
    "output",
    today,
  );
  await fs.mkdir(dir, { recursive: true });
  const outputPath = path.join(dir, "panna-workshop-poster.jpg");
  await fs.writeFile(outputPath, finalBuffer);
  console.log(`\n  ✓ ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
