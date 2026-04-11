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
  const heroUrl = 'https://res.cloudinary.com/duiyn8wll/image/upload/_Z9_20260212_100758_TMH_website_s3qioq.jpg';

  process.stdout.write('  Fetching photo... ');
  const imgBuffer = await fetch(heroUrl).then((r) => r.arrayBuffer()).then((a) => Buffer.from(a));
  console.log('done');

  // Resize background photo to 4:5 canvas, zoomed in on subject
  const metadata = await sharp(imgBuffer).metadata();
  const origW = metadata.width!;
  const origH = metadata.height!;
  const cropW = Math.round(origW * 0.7);
  const cropH = Math.round(origH * 0.7);
  const cropLeft = Math.round((origW - cropW) / 2);
  const cropTop = Math.round((origH - cropH) / 2);
  const bg = await sharp(imgBuffer)
    .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  // Satori overlay: bottom gradient + vertical accent + headline + location
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
        // Bottom gradient — photo breathes at top, fades to black at bottom
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              bottom: 0,
              left: 0,
              right: 0,
              height: Math.round(HEIGHT * 0.5),
              backgroundImage: 'linear-gradient(to bottom, rgba(8,8,8,0), rgba(8,8,8,0.75) 70%, rgba(8,8,8,0.9))',
            },
          },
        },
        // Text container — flex column anchored to bottom
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              bottom: 60,
              left: 60,
              right: 60,
              display: 'flex',
              flexDirection: 'column' as const,
              gap: 24,
            },
            children: [
              // Sage accent line
              {
                type: 'div',
                props: {
                  style: {
                    width: 60,
                    height: 2,
                    backgroundColor: C.sage,
                  },
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Playfair Display',
                    fontWeight: 700,
                    fontSize: 72,
                    color: C.white,
                    lineHeight: 1.2,
                  },
                  children: 'You don\u2019t simply visit Dhikala',
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Source Sans 3',
                    fontWeight: 600,
                    fontSize: 34,
                    color: C.sage,
                    letterSpacing: 1.5,
                  },
                  children: 'Dhikala, Jim Corbett National Park',
                },
              },
            ],
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

  // Crop bottom 12% to remove watermark, then resize to fill full canvas
  const meta2 = await sharp(imgBuffer).metadata();
  const cropH2 = Math.round(meta2.height! * 0.88);
  const cropped = await sharp(imgBuffer)
    .extract({ left: 0, top: 0, width: meta2.width!, height: cropH2 })
    .toBuffer();
  const bg = await sharp(cropped)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'left' })
    .png()
    .toBuffer();

  // Satori overlay: bottom gradient + headline + body text

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
        // Bottom gradient — photo breathes at top, fades to dark at bottom
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              bottom: 0,
              left: 0,
              right: 0,
              height: Math.round(HEIGHT * 0.55),
              backgroundImage: 'linear-gradient(to bottom, rgba(8,8,8,0), rgba(8,8,8,0.75) 55%, rgba(8,8,8,0.9))',
            },
          },
        },
        // Text container — flex column anchored to bottom
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              bottom: 60,
              left: 60,
              right: 60,
              display: 'flex',
              flexDirection: 'column' as const,
              gap: 24,
            },
            children: [
              // Sage accent line
              {
                type: 'div',
                props: {
                  style: {
                    width: 60,
                    height: 2,
                    backgroundColor: C.sage,
                  },
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Playfair Display',
                    fontWeight: 700,
                    fontSize: 72,
                    color: C.white,
                    lineHeight: 1.2,
                  },
                  children: 'You experience Jim Corbett\u2019s writings',
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Source Sans 3',
                    fontWeight: 400,
                    fontSize: 34,
                    color: C.sage,
                    lineHeight: 1.55,
                  },
                  children:
                    'Sal canopies overhead. Old rest houses appearing one by one. The forests he wrote about aren\u2019t pages anymore.',
                },
              },
            ],
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

  const OVERLAY_HEIGHT = 520;
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
              backgroundImage: 'linear-gradient(to top, rgba(8,8,8,0.7), rgba(8,8,8,0))',
            },
          },
        },
        // Text container — flex column anchored to bottom
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              bottom: 60,
              left: 60,
              right: 60,
              display: 'flex',
              flexDirection: 'column' as const,
              gap: 24,
            },
            children: [
              // Sage accent line
              {
                type: 'div',
                props: {
                  style: {
                    width: 60,
                    height: 2,
                    backgroundColor: C.sage,
                  },
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Playfair Display',
                    fontWeight: 700,
                    fontSize: 72,
                    color: C.white,
                    lineHeight: 1.3,
                  },
                  children: 'Every encounter leaves you a little more still',
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Source Sans 3',
                    fontWeight: 400,
                    fontSize: 34,
                    color: C.sage,
                    lineHeight: 1.5,
                  },
                  children: 'Soft winter light. Sambar crossing rivers in no rush. Tigers patrolling the Ramganga.',
                },
              },
            ],
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
  const headline = 'The forest before it wakes';
  const body = 'Before the first barking deer. Before the first jeep. Just this.';

  // Local image — golden hour misty landscape
  const localImagePath = '/Users/tarang/Desktop/TMH_3368.jpg';
  process.stdout.write('  Loading local photo... ');
  const imgBuffer = await fs.readFile(localImagePath);
  console.log('done');

  const bg = await sharp(imgBuffer)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

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
        // Bottom gradient overlay for text legibility
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              bottom: 0,
              left: 0,
              right: 0,
              height: Math.round(HEIGHT * 0.55),
              backgroundImage: 'linear-gradient(to bottom, rgba(8,8,8,0), rgba(8,8,8,0.75) 55%, rgba(8,8,8,0.9))',
            },
          },
        },
        // Text container — flex column anchored to bottom
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              bottom: 60,
              left: 60,
              right: 60,
              display: 'flex',
              flexDirection: 'column' as const,
              gap: 24,
            },
            children: [
              // Sage accent line
              {
                type: 'div',
                props: {
                  style: {
                    width: 60,
                    height: 2,
                    backgroundColor: C.sage,
                  },
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Playfair Display',
                    fontWeight: 700,
                    fontSize: 72,
                    color: C.white,
                    lineHeight: 1.2,
                  },
                  children: headline,
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Source Sans 3',
                    fontWeight: 400,
                    fontSize: 34,
                    color: C.sage,
                    lineHeight: 1.55,
                  },
                  children: body,
                },
              },
            ],
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

async function generateSlide5(post: any, fonts: Awaited<ReturnType<typeof loadFonts>>): Promise<Buffer> {
  const images = post.content.filter((b: any) => b.type === 'image');
  const photoUrl = images[images.length - 1].image.url; // tiger on forest road

  process.stdout.write('  Fetching photo... ');
  const imgBuffer = await fetch(photoUrl).then((r) => r.arrayBuffer()).then((a) => Buffer.from(a));
  console.log('done');

  // Full-bleed photo — anchor bottom so tiger is visible
  const bg = await sharp(imgBuffer)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'bottom' })
    .png()
    .toBuffer();

  // Satori overlay: bottom gradient + headline + subtitle
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
        // Bottom gradient
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              bottom: 0,
              left: 0,
              right: 0,
              height: Math.round(HEIGHT * 0.55),
              backgroundImage: 'linear-gradient(to bottom, rgba(8,8,8,0), rgba(8,8,8,0.75) 55%, rgba(8,8,8,0.9))',
            },
          },
        },
        // Text container — flex column anchored to bottom
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              bottom: 60,
              left: 60,
              right: 60,
              display: 'flex',
              flexDirection: 'column' as const,
              gap: 24,
            },
            children: [
              // Sage accent line
              {
                type: 'div',
                props: {
                  style: {
                    width: 60,
                    height: 2,
                    backgroundColor: C.sage,
                  },
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Playfair Display',
                    fontWeight: 700,
                    fontSize: 72,
                    color: C.white,
                    lineHeight: 1.3,
                  },
                  children: 'Nothing left to do but watch the road',
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Source Sans 3',
                    fontWeight: 400,
                    fontSize: 34,
                    color: C.sage,
                    lineHeight: 1.5,
                  },
                  children: 'Camera ready. Settings dialed in. The forest does the rest.',
                },
              },
            ],
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
              fontSize: 34,
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
              fontSize: 80,
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
