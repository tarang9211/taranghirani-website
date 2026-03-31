import satori from 'satori';
import sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { getPostBySlug } from '../lib/blog/posts.js';

// 4:5 portrait — standard Instagram carousel format
const WIDTH = 1080;
const HEIGHT = 1350;

const C = {
  charcoal: '#080808',
  paper: '#F5F5F3',
  smoke: '#525252',
  sage: '#C4956A',
  white: '#FFFFFF',
};

// Photo occupies top 58% of the 4:5 canvas; paper panel fills the rest
const PHOTO_HEIGHT = Math.round(HEIGHT * 0.58); // 783px
const PANEL_HEIGHT = HEIGHT - PHOTO_HEIGHT;      // 567px

const FONTS_DIR = path.join(process.cwd(), 'node_modules');

async function loadFonts() {
  const [playfairBold, playfairBoldItalic, sourceSansRegular, sourceSansSemiBold] = await Promise.all([
    fs.readFile(path.join(FONTS_DIR, '@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff')),
    fs.readFile(path.join(FONTS_DIR, '@fontsource/playfair-display/files/playfair-display-latin-700-italic.woff')),
    fs.readFile(path.join(FONTS_DIR, '@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff')),
    fs.readFile(path.join(FONTS_DIR, '@fontsource/source-sans-3/files/source-sans-3-latin-600-normal.woff')),
  ]);

  return [
    { name: 'Playfair Display', data: playfairBold.buffer as ArrayBuffer, weight: 700 as const, style: 'normal' as const },
    { name: 'Playfair Display', data: playfairBoldItalic.buffer as ArrayBuffer, weight: 700 as const, style: 'italic' as const },
    { name: 'Source Sans 3', data: sourceSansRegular.buffer as ArrayBuffer, weight: 400 as const, style: 'normal' as const },
    { name: 'Source Sans 3', data: sourceSansSemiBold.buffer as ArrayBuffer, weight: 600 as const, style: 'normal' as const },
  ];
}

async function generateSlide1(post: any, fonts: Awaited<ReturnType<typeof loadFonts>>): Promise<Buffer> {
  const images = post.content.filter((b: any) => b.type === 'image');
  const heroUrl = images[images.length - 1].image.url;

  process.stdout.write('  Fetching photo... ');
  const imgBuffer = await fetch(heroUrl).then((r) => r.arrayBuffer()).then((a) => Buffer.from(a));
  console.log('done');

  // Resize background photo to 4:5 canvas
  const bg = await sharp(imgBuffer)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  // Satori overlay: dark tint + headline + accent line + location text
  const overlay = {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        position: 'relative' as const,
      },
      children: [
        // Dark overlay tint
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(8,8,8,0.65)',
            },
          },
        },
        // Headline — centered, upper half
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: 420,
              left: 80,
              right: 80,
              display: 'flex',
              justifyContent: 'center',
            },
            children: {
              type: 'span',
              props: {
                style: {
                  fontFamily: 'Playfair Display',
                  fontWeight: 700,
                  fontSize: 72,
                  color: C.white,
                  textAlign: 'center' as const,
                  lineHeight: 1.25,
                },
                children: 'You don\u2019t simply visit Dhikala.',
              },
            },
          },
        },
        // Accent line above location text
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              bottom: 110,
              left: 60,
              width: 100,
              height: 2,
              backgroundColor: C.sage,
            },
          },
        },
        // Location text
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              bottom: 72,
              left: 60,
              fontFamily: 'Source Sans 3',
              fontWeight: 400,
              fontSize: 20,
              color: C.sage,
            },
            children: 'Dhikala, Jim Corbett National Park',
          },
        },
      ],
    },
  };

  process.stdout.write('  Rendering overlay... ');
  const svg = await satori(overlay as any, { width: WIDTH, height: HEIGHT, fonts });
  console.log('done');

  const overlayPng = await sharp(Buffer.from(svg)).png().toBuffer();

  return sharp(bg)
    .composite([{ input: overlayPng, blend: 'over' }])
    .jpeg({ quality: 95 })
    .toBuffer();
}

async function generateSlide2(post: any, fonts: Awaited<ReturnType<typeof loadFonts>>): Promise<Buffer> {
  const images = post.content.filter((b: any) => b.type === 'image');
  const photoUrl = images[0].image.url; // first image — Sal canopy light

  process.stdout.write('  Fetching photo... ');
  const imgBuffer = await fetch(photoUrl).then((r) => r.arrayBuffer()).then((a) => Buffer.from(a));
  console.log('done');

  // Resize photo to fill the top panel only
  const photo = await sharp(imgBuffer)
    .resize(WIDTH, PHOTO_HEIGHT, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  // Build full canvas: paper background + photo at top
  const canvas = await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: C.paper },
  })
    .composite([{ input: photo, top: 0, left: 0 }])
    .png()
    .toBuffer();

  // Satori overlay: slide number, sage line, headline, body text
  const overlay = {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        position: 'relative' as const,
      },
      children: [
        // Slide number — top-right, over the photo
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: 40,
              right: 48,
              fontFamily: 'Source Sans 3',
              fontWeight: 600,
              fontSize: 18,
              color: C.sage,
            },
            children: '02',
          },
        },
        // Sage accent line — top of paper panel
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: PHOTO_HEIGHT + 28,
              left: 60,
              width: WIDTH - 120,
              height: 2,
              backgroundColor: C.sage,
            },
          },
        },
        // Headline
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: PHOTO_HEIGHT + 48,
              left: 60,
              right: 60,
              display: 'flex',
            },
            children: {
              type: 'span',
              props: {
                style: {
                  fontFamily: 'Playfair Display',
                  fontWeight: 700,
                  fontSize: 52,
                  color: C.charcoal,
                  lineHeight: 1.3,
                },
                children: 'Where Jim Corbett\u2019s words come alive.',
              },
            },
          },
        },
        // Body text
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: PHOTO_HEIGHT + 230,
              left: 60,
              right: 60,
              display: 'flex',
            },
            children: {
              type: 'span',
              props: {
                style: {
                  fontFamily: 'Source Sans 3',
                  fontWeight: 400,
                  fontSize: 26,
                  color: C.smoke,
                  lineHeight: 1.55,
                },
                children:
                  'Sal canopies overhead. Old rest houses appearing one by one. The forests he wrote about aren\u2019t pages anymore.',
              },
            },
          },
        },
      ],
    },
  };

  process.stdout.write('  Rendering overlay... ');
  const svg = await satori(overlay as any, { width: WIDTH, height: HEIGHT, fonts });
  console.log('done');

  const overlayPng = await sharp(Buffer.from(svg)).png().toBuffer();

  return sharp(canvas)
    .composite([{ input: overlayPng, blend: 'over' }])
    .jpeg({ quality: 95 })
    .toBuffer();
}

async function generateSlide3(post: any, fonts: Awaited<ReturnType<typeof loadFonts>>): Promise<Buffer> {
  const images = post.content.filter((b: any) => b.type === 'image');
  const photoUrl = images[1].image.url; // second image — Sal road, canopy overhead

  process.stdout.write('  Fetching photo... ');
  const imgBuffer = await fetch(photoUrl).then((r) => r.arrayBuffer()).then((a) => Buffer.from(a));
  console.log('done');

  const bg = await sharp(imgBuffer)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  const OVERLAY_HEIGHT = 420;
  const OVERLAY_TOP = HEIGHT - OVERLAY_HEIGHT; // 930px

  const overlay = {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        position: 'relative' as const,
      },
      children: [
        // Dark panel at bottom
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              bottom: 0,
              left: 0,
              right: 0,
              height: OVERLAY_HEIGHT,
              backgroundColor: 'rgba(8,8,8,0.82)',
            },
          },
        },
        // Slide number — top-right
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: 40,
              right: 48,
              fontFamily: 'Source Sans 3',
              fontWeight: 600,
              fontSize: 18,
              color: C.sage,
            },
            children: '03',
          },
        },
        // Sage accent line — above headline
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: OVERLAY_TOP + 28,
              left: 60,
              width: 60,
              height: 2,
              backgroundColor: C.sage,
            },
          },
        },
        // Headline — Playfair Display Bold Italic
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: OVERLAY_TOP + 48,
              left: 60,
              right: 60,
              display: 'flex',
            },
            children: {
              type: 'span',
              props: {
                style: {
                  fontFamily: 'Playfair Display',
                  fontWeight: 700,
                  fontSize: 52,
                  color: C.white,
                  lineHeight: 1.3,
                },
                children: 'Every encounter leaves you a little more still.',
              },
            },
          },
        },
        // Body text — sage, Source Sans 3
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: OVERLAY_TOP + 240,
              left: 60,
              right: 60,
              display: 'flex',
            },
            children: {
              type: 'span',
              props: {
                style: {
                  fontFamily: 'Source Sans 3',
                  fontWeight: 400,
                  fontSize: 26,
                  color: C.sage,
                  lineHeight: 1.5,
                },
                children: 'Soft winter light. Sambar crossing rivers in no rush. Tigers patrolling the Ramganga.',
              },
            },
          },
        },
      ],
    },
  };

  process.stdout.write('  Rendering overlay... ');
  const svg = await satori(overlay as any, { width: WIDTH, height: HEIGHT, fonts });
  console.log('done');

  const overlayPng = await sharp(Buffer.from(svg)).png().toBuffer();

  return sharp(bg)
    .composite([{ input: overlayPng, blend: 'over' }])
    .jpeg({ quality: 95 })
    .toBuffer();
}

async function generateSlide4(post: any, fonts: Awaited<ReturnType<typeof loadFonts>>): Promise<Buffer> {
  const quoteBlock = post.content.find((b: any) => b.type === 'quote');
  const quoteText = quoteBlock.text as string;

  const headline = 'Shoot with Intent.';
  const body = quoteText;

  const HEADLINE_Y = 460;
  const LINE_Y = 620;
  const BODY_Y = 658;
  const ATTR_Y = 1020;

  const element = {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        position: 'relative' as const,
        backgroundColor: C.charcoal,
      },
      children: [
        // Decorative opening quote mark — faint sage, top-left
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: 40,
              left: 44,
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              fontSize: 200,
              color: C.sage,
              opacity: 0.3,
              lineHeight: 1,
            },
            children: '\u201C',
          },
        },
        // Headline — "Don't chase the frame."
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: HEADLINE_Y,
              left: 80,
              right: 80,
              display: 'flex',
              justifyContent: 'center',
            },
            children: {
              type: 'span',
              props: {
                style: {
                  fontFamily: 'Playfair Display',
                  fontWeight: 700,
                  fontSize: 80,
                  color: C.white,
                  textAlign: 'center' as const,
                  lineHeight: 1.2,
                },
                children: headline,
              },
            },
          },
        },
        // Sage rule below headline
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: LINE_Y,
              left: WIDTH / 2 - 40,
              width: 80,
              height: 2,
              backgroundColor: C.sage,
            },
          },
        },
        // Body — rest of the quote
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: BODY_Y,
              left: 80,
              right: 80,
              display: 'flex',
              justifyContent: 'center',
            },
            children: {
              type: 'span',
              props: {
                style: {
                  fontFamily: 'Source Sans 3',
                  fontWeight: 400,
                  fontSize: 26,
                  color: C.smoke,
                  textAlign: 'center' as const,
                  lineHeight: 1.65,
                },
                children: body,
              },
            },
          },
        },
      ],
    },
  };

  process.stdout.write('  Rendering slide... ');
  const svg = await satori(element as any, { width: WIDTH, height: HEIGHT, fonts });
  console.log('done');

  return sharp(Buffer.from(svg)).jpeg({ quality: 95 }).toBuffer();
}

async function generateSlide5(post: any, fonts: Awaited<ReturnType<typeof loadFonts>>): Promise<Buffer> {
  const images = post.content.filter((b: any) => b.type === 'image');
  const photoUrl = images[images.length - 1].image.url; // tiger on forest road

  process.stdout.write('  Fetching photo... ');
  const imgBuffer = await fetch(photoUrl).then((r) => r.arrayBuffer()).then((a) => Buffer.from(a));
  console.log('done');

  const DIVIDER_X = 536;
  const RIGHT_WIDTH = WIDTH - DIVIDER_X;

  // Paper background + tiger photo composited on the right half
  const photo = await sharp(imgBuffer)
    .resize(RIGHT_WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  const canvas = await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: C.paper },
  })
    .composite([{ input: photo, top: 0, left: DIVIDER_X }])
    .png()
    .toBuffer();

  // Satori overlay: label, headline, body, vertical sage line
  const overlay = {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        position: 'relative' as const,
      },
      children: [
        // Label — "04 / THE SETUP"
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: 80,
              left: 60,
              fontFamily: 'Source Sans 3',
              fontWeight: 600,
              fontSize: 14,
              color: C.sage,
              letterSpacing: 2.5,
            },
            children: '04 / THE SETUP',
          },
        },
        // Headline
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: 440,
              left: 60,
              right: WIDTH - DIVIDER_X + 80,
              display: 'flex',
            },
            children: {
              type: 'span',
              props: {
                style: {
                  fontFamily: 'Playfair Display',
                  fontWeight: 700,
                  fontSize: 48,
                  color: C.charcoal,
                  lineHeight: 1.35,
                },
                children: 'Settings dialed in. Nothing left to do but watch the road.',
              },
            },
          },
        },
        // Body text
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: 780,
              left: 60,
              right: WIDTH - DIVIDER_X + 80,
              display: 'flex',
            },
            children: {
              type: 'span',
              props: {
                style: {
                  fontFamily: 'Source Sans 3',
                  fontWeight: 400,
                  fontSize: 22,
                  color: C.smoke,
                  lineHeight: 1.6,
                },
                children: 'Camera ready before the tiger appeared. When it stepped out, the only thing left to do was watch.',
              },
            },
          },
        },
        // Vertical sage divider
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: 80,
              left: DIVIDER_X,
              width: 2,
              height: HEIGHT - 160,
              backgroundColor: C.sage,
            },
          },
        },
      ],
    },
  };

  process.stdout.write('  Rendering overlay... ');
  const svg = await satori(overlay as any, { width: WIDTH, height: HEIGHT, fonts });
  console.log('done');

  const overlayPng = await sharp(Buffer.from(svg)).png().toBuffer();

  return sharp(canvas)
    .composite([{ input: overlayPng, blend: 'over' }])
    .jpeg({ quality: 95 })
    .toBuffer();
}

async function generateSlide6(post: any, fonts: Awaited<ReturnType<typeof loadFonts>>): Promise<Buffer> {
  const images = post.content.filter((b: any) => b.type === 'image');

  const CTA_H = 220;
  const GRID_H = HEIGHT - CTA_H;       // 1130px — image grid area
  const GUTTER = 4;
  const LEFT_W = 530;
  const RIGHT_W = WIDTH - LEFT_W - GUTTER; // 546px
  const RIGHT_H = Math.floor((GRID_H - GUTTER) / 2); // 563px each

  process.stdout.write('  Fetching photos... ');
  const [leftBuf, topRightBuf, botRightBuf] = await Promise.all([
    // Left portrait: tiger on road
    fetch(images[2].image.url).then((r) => r.arrayBuffer()).then((a) => Buffer.from(a)),
    // Top-right: Sal canopy light
    fetch(images[0].image.url).then((r) => r.arrayBuffer()).then((a) => Buffer.from(a)),
    // Bottom-right: Sal road
    fetch(images[1].image.url).then((r) => r.arrayBuffer()).then((a) => Buffer.from(a)),
  ]);
  console.log('done');

  const [leftImg, topRightImg, botRightImg] = await Promise.all([
    sharp(leftBuf).resize(LEFT_W, GRID_H, { fit: 'cover', position: 'centre' }).png().toBuffer(),
    sharp(topRightBuf).resize(RIGHT_W, RIGHT_H, { fit: 'cover', position: 'centre' }).png().toBuffer(),
    sharp(botRightBuf).resize(RIGHT_W, RIGHT_H, { fit: 'cover', position: 'centre' }).png().toBuffer(),
  ]);

  const canvas = await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: C.charcoal },
  })
    .composite([
      { input: leftImg,     top: 0,                    left: 0 },
      { input: topRightImg, top: 0,                    left: LEFT_W + GUTTER },
      { input: botRightImg, top: RIGHT_H + GUTTER,     left: LEFT_W + GUTTER },
    ])
    .png()
    .toBuffer();

  // Satori overlay: sage rule + CTA text
  const overlay = {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        position: 'relative' as const,
      },
      children: [
        // Sage rule separating grid from CTA
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: GRID_H,
              left: 0,
              width: WIDTH,
              height: 2,
              backgroundColor: C.sage,
            },
          },
        },
        // URL
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: GRID_H + 36,
              left: 60,
              fontFamily: 'Source Sans 3',
              fontWeight: 600,
              fontSize: 18,
              color: C.sage,
            },
            children: 'taranghirani.com/blog/shooting-with-intent',
          },
        },
        // CTA headline
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: GRID_H + 76,
              left: 60,
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              fontSize: 48,
              color: C.white,
            },
            children: 'Read the full story',
          },
        },
      ],
    },
  };

  process.stdout.write('  Rendering overlay... ');
  const svg = await satori(overlay as any, { width: WIDTH, height: HEIGHT, fonts });
  console.log('done');

  const overlayPng = await sharp(Buffer.from(svg)).png().toBuffer();

  return sharp(canvas)
    .composite([{ input: overlayPng, blend: 'over' }])
    .jpeg({ quality: 95 })
    .toBuffer();
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: npm run carousel <slug>');
    process.exit(1);
  }

  const post = getPostBySlug(slug);
  if (!post) {
    console.error(`Post not found: "${slug}"`);
    process.exit(1);
  }

  const today = new Date().toISOString().slice(0, 10);
  const dir = path.join(process.cwd(), '.claude', 'skills', 'social-carousel', 'output', today);
  await fs.mkdir(dir, { recursive: true });

  console.log(`\nGenerating carousel for: ${post.title} (1080×1350 — 4:5)`);

  process.stdout.write('Loading fonts... ');
  const fonts = await loadFonts();
  console.log('done');

  const slides: Array<{ label: string; fn: () => Promise<Buffer> }> = [
    { label: 'slide-1', fn: () => generateSlide1(post, fonts) },
    { label: 'slide-2', fn: () => generateSlide2(post, fonts) },
    { label: 'slide-3', fn: () => generateSlide3(post, fonts) },
    { label: 'slide-4', fn: () => generateSlide4(post, fonts) },
    { label: 'slide-5', fn: () => generateSlide5(post, fonts) },
    { label: 'slide-6', fn: () => generateSlide6(post, fonts) },
  ];

  for (const { label, fn } of slides) {
    console.log(`\nSlide ${label.split('-')[1]}:`);
    const jpg = await fn();
    const filename = `${today}-${slug}-${label}.jpg`;
    await fs.writeFile(path.join(dir, filename), jpg);
    console.log(`  ✓ .claude/skills/social-carousel/output/${today}/${filename}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
