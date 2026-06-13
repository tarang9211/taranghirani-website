import satori from "satori";
import sharp from "sharp";
import * as fs from "fs/promises";
import { readdirSync, existsSync } from "fs";
import * as path from "path";

const C = {
  charcoal: "#080808",
  paper: "#F5F5F3",
  smoke: "#525252",
  sage: "#C4956A",
  white: "#FFFFFF",
};

type Format = "post" | "story" | "square";

const DIMS: Record<Format, { width: number; height: number }> = {
  post: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
  square: { width: 2692, height: 2692 },
};

const FONTS_DIR = path.join(process.cwd(), "node_modules");
const SKILL_DIR = path.join(
  process.cwd(),
  ".claude",
  "skills",
  "tour-poster",
);
const INPUT_DIR = path.join(SKILL_DIR, "input");
const OUTPUT_ROOT = path.join(SKILL_DIR, "output");

const PLATFORM_SUFFIX: Record<Format, string> = {
  story: "instagram_story",
  post: "instagram_post",
  square: "whatsapp",
};

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

type Args = {
  image: string;
  location: string;
  dates: string;
  seatsTotal: number;
  seatsFilled: number;
  seatsText: string | null;
  price: string;
  phone: string;
  priceOriginal: string | null;
  discountLabel: string;
  priceSuffix: string;
  eyebrow: string | null;
  exclusivity: string | null;
  tagline: string | null;
  subtitle: string | null;
  locationItalic: boolean;
  instagram: string;
  website: string;
  name: string;
  formats: Format[];
  layout: "vertical" | "horizontal";
};

function flag(name: string): string | null {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return null;
  const val = process.argv[idx + 1];
  if (!val || val.startsWith("--")) return null;
  return val;
}

function boolFlag(name: string): boolean {
  return process.argv.indexOf(`--${name}`) !== -1;
}

function required(name: string): string {
  const v = flag(name);
  if (!v) {
    console.error(`Missing required --${name}`);
    process.exit(1);
  }
  return v;
}

function snakeify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function resolveImage(raw: string | null): string {
  if (raw === null) {
    if (!existsSync(INPUT_DIR)) {
      console.error(
        `No images in ${path.relative(process.cwd(), INPUT_DIR)}/ — directory does not exist. Drop one in and re-run, or pass --image <path>.`,
      );
      process.exit(1);
    }
    const candidates = readdirSync(INPUT_DIR)
      .filter((f) => IMAGE_EXT.test(f))
      .sort();
    if (candidates.length === 0) {
      console.error(
        `No images in ${path.relative(process.cwd(), INPUT_DIR)}/. Drop one in and re-run, or pass --image <path>.`,
      );
      process.exit(1);
    }
    if (candidates.length > 1) {
      console.error(
        `Multiple images in ${path.relative(process.cwd(), INPUT_DIR)}/: ${candidates.join(", ")}.\nPass --image <filename> to pick one.`,
      );
      process.exit(1);
    }
    const picked = path.join(INPUT_DIR, candidates[0]);
    console.log(`Using ${candidates[0]} from input/`);
    return picked;
  }

  const looksLikePath =
    raw.includes("/") ||
    raw.startsWith(".") ||
    raw.startsWith("~") ||
    raw.startsWith("/");

  if (looksLikePath) {
    if (!existsSync(raw)) {
      console.error(`--image path does not exist: ${raw}`);
      process.exit(1);
    }
    return raw;
  }

  const inInputDir = path.join(INPUT_DIR, raw);
  if (existsSync(inInputDir)) return inInputDir;

  if (existsSync(raw)) return raw;

  console.error(
    `Image not found.\n  Tried: ${path.relative(process.cwd(), inInputDir)}\n  Tried: ${raw}`,
  );
  process.exit(1);
}

function parseArgs(): Args {
  const location = required("location");
  const seatsText = flag("seats-text");
  const seatsTotalRaw = flag("seats-total");
  const seatsFilledRaw = flag("seats-filled");

  let seatsTotal = 0;
  let seatsFilled = 0;

  if (seatsText) {
    if (seatsTotalRaw || seatsFilledRaw) {
      console.warn(
        "Both --seats-text and numeric --seats-* flags supplied; using --seats-text (dots indicator suppressed).",
      );
    }
  } else {
    if (!seatsTotalRaw || !seatsFilledRaw) {
      console.error(
        "Provide either --seats-text \"<label>\" OR both --seats-total + --seats-filled (integers).",
      );
      process.exit(1);
    }
    seatsTotal = parseInt(seatsTotalRaw, 10);
    seatsFilled = parseInt(seatsFilledRaw, 10);
    if (
      Number.isNaN(seatsTotal) ||
      Number.isNaN(seatsFilled) ||
      seatsFilled < 0 ||
      seatsFilled > seatsTotal ||
      seatsTotal < 1
    ) {
      console.error(
        "--seats-total must be a positive integer; --seats-filled must be 0..seats-total",
      );
      process.exit(1);
    }
  }

  const formatsRaw = flag("formats") ?? "story,post,square";
  const formats = formatsRaw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(
      (s): s is Format => s === "post" || s === "story" || s === "square",
    );

  if (formats.length === 0) {
    console.error("--formats must contain at least one of story|post|square");
    process.exit(1);
  }

  const layoutRaw = (flag("layout") ?? "vertical").toLowerCase();
  if (layoutRaw !== "vertical" && layoutRaw !== "horizontal") {
    console.error("--layout must be 'vertical' or 'horizontal'");
    process.exit(1);
  }
  const layout = layoutRaw as "vertical" | "horizontal";

  return {
    image: resolveImage(flag("image")),
    location,
    dates: required("dates"),
    seatsTotal,
    seatsFilled,
    seatsText,
    price: required("price"),
    phone: required("phone"),
    priceOriginal: flag("price-original"),
    discountLabel: flag("discount-label") ?? "EARLY BIRD",
    priceSuffix: flag("price-suffix") ?? "/ PERSON",
    eyebrow: flag("eyebrow"),
    exclusivity: flag("exclusivity"),
    tagline: flag("tagline"),
    subtitle: flag("subtitle"),
    locationItalic: boolFlag("location-italic"),
    instagram: flag("instagram") ?? "@tarang.hirani",
    website: flag("website") ?? "taranghirani.com",
    name: snakeify(flag("name") ?? location),
    formats,
    layout,
  };
}

async function loadFonts() {
  const [
    playfairBold,
    playfairBoldItalic,
    sourceSansRegular,
    sourceSansMedium,
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
        "@fontsource/source-sans-3/files/source-sans-3-latin-500-normal.woff",
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
      data: sourceSansMedium.buffer as ArrayBuffer,
      weight: 500 as const,
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

function vignetteSvg(format: Format, width: number, height: number): Buffer {
  let topStops: string;
  let bottomStops: string;
  if (format === "story") {
    topStops = `
      <stop offset="0%" stop-color="rgba(8,8,8,0.65)"/>
      <stop offset="10%" stop-color="rgba(8,8,8,0.35)"/>
      <stop offset="20%" stop-color="rgba(8,8,8,0.0)"/>
    `;
    bottomStops = `
      <stop offset="0%" stop-color="rgba(8,8,8,0.92)"/>
      <stop offset="40%" stop-color="rgba(8,8,8,0.55)"/>
      <stop offset="65%" stop-color="rgba(8,8,8,0.0)"/>
    `;
  } else if (format === "square") {
    topStops = `
      <stop offset="0%" stop-color="rgba(8,8,8,0.55)"/>
      <stop offset="20%" stop-color="rgba(8,8,8,0.0)"/>
    `;
    bottomStops = `
      <stop offset="0%" stop-color="rgba(8,8,8,0.92)"/>
      <stop offset="50%" stop-color="rgba(8,8,8,0.45)"/>
      <stop offset="75%" stop-color="rgba(8,8,8,0.0)"/>
    `;
  } else {
    topStops = `
      <stop offset="0%" stop-color="rgba(8,8,8,0.80)"/>
      <stop offset="14%" stop-color="rgba(8,8,8,0.45)"/>
      <stop offset="25%" stop-color="rgba(8,8,8,0.0)"/>
    `;
    bottomStops = `
      <stop offset="0%" stop-color="rgba(8,8,8,0.92)"/>
      <stop offset="40%" stop-color="rgba(8,8,8,0.55)"/>
      <stop offset="60%" stop-color="rgba(8,8,8,0.0)"/>
    `;
  }
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="topShade" x1="0" y1="0" x2="0" y2="1">${topStops}</linearGradient>
        <linearGradient id="bottomShade" x1="0" y1="1" x2="0" y2="0">${bottomStops}</linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#topShade)"/>
      <rect width="100%" height="100%" fill="url(#bottomShade)"/>
    </svg>`,
  );
}

async function buildBackground(
  imagePath: string,
  width: number,
  height: number,
  format: Format,
): Promise<Buffer> {
  const imgBuffer = await fs.readFile(imagePath);
  const cover = await sharp(imgBuffer)
    .resize(width, height, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();

  return sharp(cover)
    .composite([{ input: vignetteSvg(format, width, height), blend: "over" }])
    .png()
    .toBuffer();
}

function seatCaption(filled: number, total: number): string {
  const remaining = total - filled;
  if (filled === total) return "FULLY BOOKED";
  if (filled === 0) return `${total} SEATS OPEN`;
  if (remaining === 1) return "1 SEAT LEFT";
  return `${remaining} OF ${total} SEATS REMAINING`;
}

function dotsRow(
  total: number,
  filled: number,
  size: number = 12,
  gap: number = 8,
) {
  const dots: any[] = [];
  for (let i = 0; i < total; i++) {
    const isFilled = i < filled;
    dots.push({
      type: "div",
      props: {
        style: {
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: isFilled ? "rgba(82,82,82,0.6)" : C.sage,
        },
      },
    });
  }
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "row" as const,
        alignItems: "center",
        gap,
      },
      children: dots,
    },
  };
}

function pricingNode(
  args: Args,
  sizes: { eyebrow: number; struck: number; price: number },
  align: "flex-start" | "center" = "flex-start",
  stackedSuffix: boolean = false,
) {
  const children: any[] = [];
  if (args.priceOriginal) {
    children.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 500,
          fontSize: sizes.eyebrow,
          color: C.sage,
          letterSpacing: Math.max(2, Math.round(sizes.eyebrow * 0.2)),
        },
        children: args.discountLabel.toUpperCase(),
      },
    });
    children.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 400,
          fontSize: sizes.struck,
          color: C.white,
          letterSpacing: 3,
          textDecoration: "line-through",
          marginTop: 6,
        },
        children: args.priceOriginal.toUpperCase(),
      },
    });
  }
  children.push({
    type: "span",
    props: {
      style: {
        fontFamily: "Source Sans 3",
        fontWeight: 700,
        fontSize: sizes.price,
        color: C.white,
        letterSpacing: 4,
        marginTop: args.priceOriginal ? 4 : 0,
      },
      children: stackedSuffix
        ? args.price.toUpperCase()
        : `${args.price} ${args.priceSuffix}`.toUpperCase(),
    },
  });
  if (stackedSuffix && args.priceSuffix) {
    children.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 500,
          fontSize: Math.round(sizes.price * 0.55),
          color: C.paper,
          letterSpacing: 3,
          marginTop: 4,
        },
        children: args.priceSuffix.toUpperCase(),
      },
    });
  }
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: align,
      },
      children,
    },
  };
}

function seatsHorizontal(args: Args, dotSize: number, captionSize: number) {
  if (args.seatsText) {
    return {
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 700,
          fontSize: captionSize,
          color: C.sage,
          letterSpacing: 4,
        },
        children: args.seatsText.toUpperCase(),
      },
    };
  }
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "row" as const,
        alignItems: "center",
        gap: 16,
      },
      children: [
        dotsRow(args.seatsTotal, args.seatsFilled, dotSize),
        {
          type: "span",
          props: {
            style: {
              fontFamily: "Source Sans 3",
              fontWeight: 700,
              fontSize: captionSize,
              color: C.sage,
              letterSpacing: 4,
            },
            children: seatCaption(args.seatsFilled, args.seatsTotal),
          },
        },
      ],
    },
  };
}

function seatsStacked(args: Args, dotSize: number, captionSize: number) {
  if (args.seatsText) {
    return {
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 700,
          fontSize: captionSize,
          color: C.sage,
          letterSpacing: 4,
          textAlign: "center" as const,
        },
        children: args.seatsText.toUpperCase(),
      },
    };
  }
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        gap: 10,
      },
      children: [
        dotsRow(args.seatsTotal, args.seatsFilled, dotSize, 10),
        {
          type: "span",
          props: {
            style: {
              fontFamily: "Source Sans 3",
              fontWeight: 700,
              fontSize: captionSize,
              color: C.sage,
              letterSpacing: 4,
            },
            children: seatCaption(args.seatsFilled, args.seatsTotal),
          },
        },
      ],
    },
  };
}

function footerBlock(
  args: Args,
  phoneSize: number,
  handleSize: number,
  align: "flex-start" | "center" = "flex-start",
) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: align,
        width: "100%",
      },
      children: [
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
        {
          type: "span",
          props: {
            style: {
              fontFamily: "Source Sans 3",
              fontWeight: 700,
              fontSize: phoneSize,
              color: C.white,
              letterSpacing: 2,
              marginTop: 18,
            },
            children: `CALL ${args.phone}`,
          },
        },
        {
          type: "span",
          props: {
            style: {
              fontFamily: "Source Sans 3",
              fontWeight: 600,
              fontSize: handleSize,
              color: C.sage,
              letterSpacing: 3,
              marginTop: 6,
            },
            children: `${args.instagram}  ·  ${args.website}`,
          },
        },
      ],
    },
  };
}

function topHookBlock(
  args: Args,
  opts: {
    taglineFont: number;
    rule: number;
    top: number;
    left: number;
    right: number;
    includeTagline?: boolean;
  },
) {
  const tagline = (opts.includeTagline ?? true) ? args.tagline : null;
  if (!tagline) return null;

  return {
    type: "div",
    props: {
      style: {
        position: "absolute",
        top: opts.top,
        left: opts.left,
        right: opts.right,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
      },
      children: [
        {
          type: "span",
          props: {
            style: {
              fontFamily: "Playfair Display",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: opts.taglineFont,
              color: C.white,
              letterSpacing: 0.5,
              textAlign: "center" as const,
              lineHeight: 1.25,
            },
            children: tagline,
          },
        },
        {
          type: "div",
          props: {
            style: {
              width: opts.rule,
              height: 1,
              backgroundColor: C.sage,
              marginTop: 14,
            },
          },
        },
      ],
    },
  };
}

function tripDetailsRow(
  args: Args,
  opts: {
    priceSizes: { eyebrow: number; struck: number; price: number };
    seatsDot: number;
    seatsCaption: number;
    datesSize: number;
    rowHeight: number;
    width: number;
    exclusivityFont: number;
  },
) {
  const datesText = args.dates.toUpperCase();
  const lastComma = datesText.lastIndexOf(",");
  const datesLines =
    lastComma >= 0
      ? [datesText.slice(0, lastComma).trim(), datesText.slice(lastComma + 1).trim()]
      : [datesText];

  const datesColumnChildren: any[] = [];
  if (args.exclusivity) {
    datesColumnChildren.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 700,
          fontSize: opts.exclusivityFont,
          color: C.sage,
          letterSpacing: Math.max(2, Math.round(opts.exclusivityFont * 0.22)),
          marginBottom: 10,
          lineHeight: 1.15,
        },
        children: args.exclusivity.toUpperCase(),
      },
    });
  }
  datesLines.forEach((line, i) => {
    datesColumnChildren.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 700,
          fontSize: opts.datesSize,
          color: C.white,
          letterSpacing: 4,
          lineHeight: 1.1,
          marginTop: i === 0 ? 0 : 6,
        },
        children: line,
      },
    });
  });

  const divider = {
    type: "div",
    props: {
      style: {
        width: 1,
        height: opts.rowHeight,
        backgroundColor: C.sage,
        opacity: 0.7,
      },
    },
  };

  const column = (
    children: any[],
    align: "flex-start" | "center",
    paddingLeft = 16,
    paddingRight = 16,
  ) => ({
    type: "div",
    props: {
      style: {
        flexGrow: 1,
        flexBasis: 0,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: align,
        justifyContent: "flex-start" as const,
        paddingLeft,
        paddingRight,
      },
      children,
    },
  });

  return {
    type: "div",
    props: {
      style: {
        width: opts.width,
        display: "flex",
        flexDirection: "row" as const,
        alignItems: "center" as const,
      },
      children: [
        column([pricingNode(args, opts.priceSizes, "flex-start", true)], "flex-start", 0, 16),
        divider,
        column([seatsStacked(args, opts.seatsDot, opts.seatsCaption)], "center"),
        divider,
        column(datesColumnChildren, "flex-start", 16, 0),
      ],
    },
  };
}

function exclusivitySpan(
  text: string,
  size: number,
  align: "flex-start" | "center" = "flex-start",
  marginTop: number,
) {
  return {
    type: "span",
    props: {
      style: {
        fontFamily: "Source Sans 3",
        fontWeight: 700,
        fontSize: size,
        color: C.sage,
        letterSpacing: Math.max(2, Math.round(size * 0.22)),
        marginTop,
        textAlign: align === "center" ? ("center" as const) : ("left" as const),
        alignSelf: align,
      },
      children: text.toUpperCase(),
    },
  };
}

function buildPostJsx(args: Args) {
  const { width: W, height: H } = DIMS.post;

  const containerChildren: any[] = [];

  const topHook = topHookBlock(args, {
    taglineFont: 34,
    rule: 48,
    top: 80,
    left: 76,
    right: 76,
  });
  if (topHook) containerChildren.push(topHook);

  const contentChildren: any[] = [];
  if (args.eyebrow) {
    contentChildren.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 500,
          fontSize: 18,
          color: C.sage,
          letterSpacing: 3,
          marginBottom: 14,
        },
        children: args.eyebrow.toUpperCase(),
      },
    });
  }
  contentChildren.push({
    type: "span",
    props: {
      style: {
        fontFamily: "Playfair Display",
        fontWeight: 700,
        fontStyle: args.locationItalic ? "italic" : "normal",
        fontSize: 156,
        color: C.white,
        lineHeight: 1.0,
      },
      children: args.location,
    },
  });
  if (args.subtitle) {
    contentChildren.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Playfair Display",
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: 36,
          color: C.paper,
          lineHeight: 1.2,
          marginTop: 6,
        },
        children: args.subtitle,
      },
    });
  }
  if (args.layout === "horizontal") {
    contentChildren.push({
      type: "div",
      props: {
        style: {
          marginTop: 30,
          display: "flex",
          width: "100%",
        },
        children: [
          tripDetailsRow(args, {
            priceSizes: { eyebrow: 16, struck: 24, price: 38 },
            seatsDot: 14,
            seatsCaption: 24,
            datesSize: 28,
            rowHeight: 156,
            width: 928,
            exclusivityFont: 22,
          }),
        ],
      },
    });
  } else {
    contentChildren.push({
      type: "div",
      props: {
        style: { marginTop: 26, display: "flex" },
        children: [pricingNode(args, { eyebrow: 18, struck: 28, price: 40 })],
      },
    });
    contentChildren.push({
      type: "div",
      props: {
        style: { marginTop: 22, display: "flex" },
        children: [seatsHorizontal(args, 15, 28)],
      },
    });
    if (args.exclusivity) {
      contentChildren.push(
        exclusivitySpan(args.exclusivity, 22, "flex-start", 22),
      );
    }
    contentChildren.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 700,
          fontSize: 32,
          color: C.white,
          letterSpacing: 4,
          marginTop: args.exclusivity ? 10 : 18,
        },
        children: args.dates.toUpperCase(),
      },
    });
  }

  containerChildren.push({
    type: "div",
    props: {
      style: {
        position: "absolute",
        left: 76,
        right: 76,
        bottom: 280,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "flex-start",
      },
      children: contentChildren,
    },
  });

  containerChildren.push({
    type: "div",
    props: {
      style: {
        position: "absolute",
        left: 76,
        right: 76,
        bottom: 130,
        display: "flex",
      },
      children: [footerBlock(args, 34, 26, "flex-start")],
    },
  });

  return {
    type: "div",
    props: {
      style: {
        width: W,
        height: H,
        display: "flex",
        flexDirection: "column" as const,
        position: "relative" as const,
        fontFamily: "Source Sans 3",
      },
      children: containerChildren,
    },
  };
}

function buildStoryJsx(args: Args) {
  const { width: W, height: H } = DIMS.story;

  const containerChildren: any[] = [];

  const topHook = topHookBlock(args, {
    taglineFont: 42,
    rule: 64,
    top: 300,
    left: 80,
    right: 80,
  });
  if (topHook) containerChildren.push(topHook);

  const contentChildren: any[] = [];
  if (args.eyebrow) {
    contentChildren.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 500,
          fontSize: 22,
          color: C.sage,
          letterSpacing: 4,
          marginBottom: 16,
        },
        children: args.eyebrow.toUpperCase(),
      },
    });
  }
  contentChildren.push({
    type: "span",
    props: {
      style: {
        fontFamily: "Playfair Display",
        fontWeight: 700,
        fontStyle: args.locationItalic ? "italic" : "normal",
        fontSize: 192,
        color: C.white,
        lineHeight: 1.0,
        textAlign: "center" as const,
      },
      children: args.location,
    },
  });
  if (args.subtitle) {
    contentChildren.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Playfair Display",
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: 44,
          color: C.paper,
          lineHeight: 1.25,
          marginTop: 10,
          textAlign: "center" as const,
        },
        children: args.subtitle,
      },
    });
  }
  if (args.layout === "horizontal") {
    contentChildren.push({
      type: "div",
      props: {
        style: {
          marginTop: 36,
          display: "flex",
          width: "100%",
        },
        children: [
          tripDetailsRow(args, {
            priceSizes: { eyebrow: 20, struck: 28, price: 42 },
            seatsDot: 16,
            seatsCaption: 26,
            datesSize: 30,
            rowHeight: 172,
            width: 920,
            exclusivityFont: 24,
          }),
        ],
      },
    });
  } else {
    contentChildren.push({
      type: "div",
      props: {
        style: {
          marginTop: 36,
          display: "flex",
        },
        children: [
          pricingNode(args, { eyebrow: 22, struck: 32, price: 48 }, "center"),
        ],
      },
    });
    contentChildren.push({
      type: "div",
      props: {
        style: { marginTop: 30, display: "flex" },
        children: [seatsStacked(args, 16, 30)],
      },
    });
    if (args.exclusivity) {
      contentChildren.push(
        exclusivitySpan(args.exclusivity, 24, "center", 30),
      );
    }
    contentChildren.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 700,
          fontSize: 36,
          color: C.white,
          letterSpacing: 4,
          marginTop: args.exclusivity ? 14 : 26,
          textAlign: "center" as const,
        },
        children: args.dates.toUpperCase(),
      },
    });
  }

  containerChildren.push({
    type: "div",
    props: {
      style: {
        position: "absolute",
        top: 700,
        left: 80,
        right: 80,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
      },
      children: contentChildren,
    },
  });

  containerChildren.push({
    type: "div",
    props: {
      style: {
        position: "absolute",
        left: 80,
        right: 80,
        bottom: 340,
        display: "flex",
      },
      children: [footerBlock(args, 40, 28, "center")],
    },
  });

  return {
    type: "div",
    props: {
      style: {
        width: W,
        height: H,
        display: "flex",
        flexDirection: "column" as const,
        position: "relative" as const,
        fontFamily: "Source Sans 3",
      },
      children: containerChildren,
    },
  };
}

function buildSquareJsx(args: Args) {
  const { width: W, height: H } = DIMS.square;

  const containerChildren: any[] = [];

  const contentChildren: any[] = [];
  if (args.eyebrow) {
    contentChildren.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 500,
          fontSize: 40,
          color: C.sage,
          letterSpacing: 7,
          marginBottom: 25,
        },
        children: args.eyebrow.toUpperCase(),
      },
    });
  }
  contentChildren.push({
    type: "span",
    props: {
      style: {
        fontFamily: "Playfair Display",
        fontWeight: 700,
        fontStyle: args.locationItalic ? "italic" : "normal",
        fontSize: 280,
        color: C.white,
        lineHeight: 1.0,
      },
      children: args.location,
    },
  });
  if (args.subtitle) {
    contentChildren.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Playfair Display",
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: 75,
          color: C.paper,
          lineHeight: 1.2,
          marginTop: 10,
        },
        children: args.subtitle,
      },
    });
  }
  if (args.layout === "horizontal") {
    contentChildren.push({
      type: "div",
      props: {
        style: {
          marginTop: 50,
          display: "flex",
          width: "100%",
        },
        children: [
          tripDetailsRow(args, {
            priceSizes: { eyebrow: 37, struck: 55, price: 80 },
            seatsDot: 32,
            seatsCaption: 55,
            datesSize: 65,
            rowHeight: 320,
            width: 2372,
            exclusivityFont: 45,
          }),
        ],
      },
    });
  } else {
    contentChildren.push({
      type: "div",
      props: {
        style: { marginTop: 45, display: "flex" },
        children: [pricingNode(args, { eyebrow: 40, struck: 60, price: 90 })],
      },
    });
    contentChildren.push({
      type: "div",
      props: {
        style: { marginTop: 40, display: "flex" },
        children: [seatsHorizontal(args, 32, 60)],
      },
    });
    if (args.exclusivity) {
      contentChildren.push(
        exclusivitySpan(args.exclusivity, 45, "flex-start", 40),
      );
    }
    contentChildren.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 700,
          fontSize: 70,
          color: C.white,
          letterSpacing: 10,
          marginTop: args.exclusivity ? 20 : 30,
        },
        children: args.dates.toUpperCase(),
      },
    });
  }

  containerChildren.push({
    type: "div",
    props: {
      style: {
        position: "absolute",
        left: 160,
        right: 160,
        bottom: 550,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "flex-start",
      },
      children: contentChildren,
    },
  });

  containerChildren.push({
    type: "div",
    props: {
      style: {
        position: "absolute",
        left: 160,
        right: 160,
        bottom: 200,
        display: "flex",
      },
      children: [footerBlock(args, 75, 55, "flex-start")],
    },
  });

  return {
    type: "div",
    props: {
      style: {
        width: W,
        height: H,
        display: "flex",
        flexDirection: "column" as const,
        position: "relative" as const,
        fontFamily: "Source Sans 3",
      },
      children: containerChildren,
    },
  };
}

const BUILDERS: Record<Format, (args: Args) => any> = {
  post: buildPostJsx,
  story: buildStoryJsx,
  square: buildSquareJsx,
};

async function renderOverlay(
  jsx: any,
  width: number,
  height: number,
  fonts: Awaited<ReturnType<typeof loadFonts>>,
): Promise<Buffer> {
  const svg = await satori(jsx, { width, height, fonts });
  return sharp(Buffer.from(svg), { density: 144 })
    .resize(width, height, { kernel: "lanczos3" })
    .png()
    .toBuffer();
}

async function renderFormat(
  args: Args,
  format: Format,
  fonts: Awaited<ReturnType<typeof loadFonts>>,
): Promise<Buffer> {
  const { width, height } = DIMS[format];
  const bg = await buildBackground(args.image, width, height, format);
  const overlay = await renderOverlay(BUILDERS[format](args), width, height, fonts);
  return sharp(bg)
    .composite([{ input: overlay, blend: "over" }])
    .jpeg({ quality: 96, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toBuffer();
}

async function main() {
  const args = parseArgs();

  process.stdout.write("Loading fonts... ");
  const fonts = await loadFonts();
  console.log("done");

  const today = new Date().toISOString().slice(0, 10);
  const dir = path.join(OUTPUT_ROOT, today);
  await fs.mkdir(dir, { recursive: true });

  for (const format of args.formats) {
    const { width, height } = DIMS[format];
    process.stdout.write(`Rendering ${format} (${width}x${height})... `);
    const buf = await renderFormat(args, format, fonts);
    const filename = `tour_poster_tmh_${args.name}_${PLATFORM_SUFFIX[format]}.jpg`;
    const out = path.join(dir, filename);
    await fs.writeFile(out, buf);
    console.log(`done\n  ✓ ${out}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
