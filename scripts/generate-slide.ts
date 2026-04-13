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
  const [playfairBold, playfairBoldItalic, sourceSansRegular, sourceSansSemiBold] =
    await Promise.all([
      fs.readFile(
        path.join(FONTS_DIR, "@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff"),
      ),
      fs.readFile(
        path.join(FONTS_DIR, "@fontsource/playfair-display/files/playfair-display-latin-700-italic.woff"),
      ),
      fs.readFile(
        path.join(FONTS_DIR, "@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff"),
      ),
      fs.readFile(
        path.join(FONTS_DIR, "@fontsource/source-sans-3/files/source-sans-3-latin-600-normal.woff"),
      ),
    ]);

  return [
    { name: "Playfair Display", data: playfairBold.buffer as ArrayBuffer, weight: 700 as const, style: "normal" as const },
    { name: "Playfair Display", data: playfairBoldItalic.buffer as ArrayBuffer, weight: 700 as const, style: "italic" as const },
    { name: "Source Sans 3", data: sourceSansRegular.buffer as ArrayBuffer, weight: 400 as const, style: "normal" as const },
    { name: "Source Sans 3", data: sourceSansSemiBold.buffer as ArrayBuffer, weight: 600 as const, style: "normal" as const },
  ];
}

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : "true";
      args[key] = val;
      if (val !== "true") i++;
    }
  }
  return args;
}

interface SlideOptions {
  imagePath: string;
  headline?: string;
  subtitle?: string;
  position: "top" | "center" | "bottom";
  gradientOpacity: number;
  fontSize: number;
  subtitleSize: number;
  cropPosition: string;
  zoom: number;
  clipText: boolean;
  fonts: Awaited<ReturnType<typeof loadFonts>>;
}

async function generateSlide(opts: SlideOptions): Promise<Buffer> {
  process.stdout.write("  Loading image... ");
  const imgBuffer = opts.imagePath.startsWith("http")
    ? await fetch(opts.imagePath).then((r) => r.arrayBuffer()).then((a) => Buffer.from(a))
    : await fs.readFile(opts.imagePath);
  console.log("done");

  // Crop/zoom if requested (zoom < 1 means crop to center N%)
  let processed = sharp(imgBuffer);
  if (opts.zoom < 1) {
    const meta = await sharp(imgBuffer).metadata();
    const cropW = Math.round(meta.width! * opts.zoom);
    const cropH = Math.round(meta.height! * opts.zoom);
    const cropLeft = Math.round((meta.width! - cropW) / 2);
    const cropTop = Math.round((meta.height! - cropH) / 2);
    processed = sharp(imgBuffer).extract({
      left: cropLeft,
      top: cropTop,
      width: cropW,
      height: cropH,
    });
  }

  const bg = await processed
    .resize(WIDTH, HEIGHT, { fit: "cover", position: opts.cropPosition as any })
    .png()
    .toBuffer();

  // No text — return the image as-is
  if (!opts.headline && !opts.subtitle) {
    return sharp(bg).jpeg({ quality: 95 }).toBuffer();
  }

  process.stdout.write("  Rendering overlay... ");

  // --- Gradient element ---
  const gradientH = Math.round(HEIGHT * 0.5);
  const opHigh = opts.gradientOpacity;
  const opMid = (opts.gradientOpacity * 0.83).toFixed(2);

  let gradientEl: any;
  if (opts.position === "bottom") {
    gradientEl = {
      type: "div",
      props: {
        style: {
          position: "absolute" as const,
          bottom: 0, left: 0, right: 0,
          height: gradientH,
          backgroundImage: `linear-gradient(to bottom, rgba(8,8,8,0), rgba(8,8,8,${opMid}) 70%, rgba(8,8,8,${opHigh}))`,
        },
      },
    };
  } else if (opts.position === "top") {
    gradientEl = {
      type: "div",
      props: {
        style: {
          position: "absolute" as const,
          top: 0, left: 0, right: 0,
          height: gradientH,
          backgroundImage: `linear-gradient(to top, rgba(8,8,8,0), rgba(8,8,8,${opMid}) 70%, rgba(8,8,8,${opHigh}))`,
        },
      },
    };
  } else {
    gradientEl = {
      type: "div",
      props: {
        style: {
          position: "absolute" as const,
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: `rgba(8,8,8,${(opHigh * 0.5).toFixed(2)})`,
        },
      },
    };
  }

  // --- Text elements ---
  const textEls: any[] = [];

  textEls.push({
    type: "div",
    props: {
      style: { width: 60, height: 2, backgroundColor: C.sage },
    },
  });

  if (opts.headline) {
    textEls.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Playfair Display",
          fontWeight: 700,
          fontSize: opts.fontSize,
          color: C.white,
          lineHeight: 1.2,
        },
        children: opts.headline,
      },
    });
  }

  if (opts.subtitle) {
    textEls.push({
      type: "span",
      props: {
        style: {
          fontFamily: "Source Sans 3",
          fontWeight: 600,
          fontSize: opts.subtitleSize,
          color: C.sage,
          letterSpacing: 1.5,
          lineHeight: 1.55,
        },
        children: opts.subtitle,
      },
    });
  }

  // --- Text container positioning ---
  const textStyle: Record<string, any> = {
    position: "absolute" as const,
    left: 60, right: 60,
    display: "flex",
    flexDirection: "column" as const,
    gap: 24,
  };

  if (opts.position === "bottom") {
    textStyle.bottom = 60;
  } else if (opts.position === "top") {
    textStyle.top = 60;
  } else {
    textStyle.top = 0;
    textStyle.height = HEIGHT;
    textStyle.justifyContent = "center";
  }

  const wrapOverlay = (children: any[]) => ({
    type: "div",
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        position: "relative" as const,
      },
      children,
    },
  });

  if (opts.clipText) {
    // --- Clip-text mode: original image shows through text ---
    const [gradientSvg, textSvg] = await Promise.all([
      satori(wrapOverlay([gradientEl]) as any, { width: WIDTH, height: HEIGHT, fonts: opts.fonts }),
      satori(
        wrapOverlay([{ type: "div", props: { style: textStyle, children: textEls } }]) as any,
        { width: WIDTH, height: HEIGHT, fonts: opts.fonts },
      ),
    ]);

    const [gradientPng, textPng] = await Promise.all([
      sharp(Buffer.from(gradientSvg)).png().toBuffer(),
      sharp(Buffer.from(textSvg)).png().toBuffer(),
    ]);

    const darkened = await sharp(bg)
      .composite([{ input: gradientPng, blend: "over" }])
      .png()
      .toBuffer();

    const clippedBg = await sharp(bg)
      .ensureAlpha()
      .composite([{ input: textPng, blend: "dest-in" }])
      .png()
      .toBuffer();

    console.log("done");

    return sharp(darkened)
      .composite([{ input: clippedBg, blend: "over" }])
      .jpeg({ quality: 95 })
      .toBuffer();
  }

  // --- Normal mode: text overlaid on gradient ---
  const overlay = wrapOverlay([
    gradientEl,
    { type: "div", props: { style: textStyle, children: textEls } },
  ]);

  const svg = await satori(overlay as any, {
    width: WIDTH,
    height: HEIGHT,
    fonts: opts.fonts,
  });
  console.log("done");

  const overlayPng = await sharp(Buffer.from(svg)).png().toBuffer();

  return sharp(bg)
    .composite([{ input: overlayPng, blend: "over" }])
    .jpeg({ quality: 95 })
    .toBuffer();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.image) {
    console.log(`
Usage: npm run slide -- --image <path> [options]

Required:
  --image <path>          Local file path or URL

Content:
  --headline <text>       Main text (Playfair Display)
  --subtitle <text>       Secondary text (Source Sans 3)

Layout:
  --position <pos>        Text position: top | center | bottom (default: bottom)
  --font-size <n>         Headline size in px (default: 72)
  --subtitle-size <n>     Subtitle size in px (default: 34)

Image:
  --crop-position <pos>   Sharp crop anchor: centre | top | bottom | left | right (default: centre)
  --zoom <n>              Crop factor 0.1-1.0, lower = more zoomed in (default: 1.0)

Style:
  --gradient-opacity <n>  Gradient strength 0-1 (default: 0.85)
  --clip-text              Text clips through to reveal the background image

Output:
  --name <name>           Output filename without extension (default: slide)
`);
    process.exit(1);
  }

  process.stdout.write("Loading fonts... ");
  const fonts = await loadFonts();
  console.log("done\n");

  const buffer = await generateSlide({
    imagePath: args.image,
    headline: args.headline,
    subtitle: args.subtitle,
    position: (args.position as "top" | "center" | "bottom") || "bottom",
    gradientOpacity: parseFloat(args["gradient-opacity"] || "0.85"),
    fontSize: parseInt(args["font-size"] || "72"),
    subtitleSize: parseInt(args["subtitle-size"] || "34"),
    cropPosition: args["crop-position"] || "centre",
    zoom: parseFloat(args.zoom || "1.0"),
    clipText: args["clip-text"] === "true",
    fonts,
  });

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

  const name = args.name || "slide";
  const filename = `${name}.jpg`;
  const outputPath = path.join(dir, filename);
  await fs.writeFile(outputPath, buffer);
  console.log(`\n  ✓ ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
