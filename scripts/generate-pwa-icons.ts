import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const faviconPath = path.resolve('public/favicon.svg');
const iconsDir = path.resolve('public/icons');

const sizes = [
  { name: 'icon-192x192.png', width: 192, height: 192, maskable: false },
  { name: 'icon-512x512.png', width: 512, height: 512, maskable: false },
  { name: 'apple-touch-icon.png', width: 180, height: 180, maskable: false },
  { name: 'maskable-icon-512x512.png', width: 512, height: 512, maskable: true },
];

async function generateIcons() {
  if (!fs.existsSync(faviconPath)) {
    console.error(`Favicon not found: ${faviconPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const svgBuffer = fs.readFileSync(faviconPath);

  for (const size of sizes) {
    const outputPath = path.join(iconsDir, size.name);

    if (size.maskable) {
      const padding = 40;
      const iconSize = size.width - padding * 2;

      const resizedIcon = await sharp(svgBuffer)
        .resize(iconSize, iconSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();

      await sharp({
        create: {
          width: size.width,
          height: size.height,
          channels: 4,
          background: { r: 37, g: 99, b: 235, alpha: 1 },
        },
      })
        .composite([{ input: resizedIcon, gravity: 'center' }])
        .png()
        .toFile(outputPath);
    } else {
      await sharp(svgBuffer)
        .resize(size.width, size.height)
        .png()
        .toFile(outputPath);
    }

    console.log(`Generated ${size.name} (${size.width}x${size.height})`);
  }

  console.log('All PWA icons generated successfully.');
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
