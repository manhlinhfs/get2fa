import { defineConfig } from "@vite-pwa/assets-generator/config";

const preset = {
  transparent: {
    sizes: [16, 32, 64, 192, 512],
    favicons: [[64, "favicon.ico"]],
  },
  maskable: {
    sizes: [512],
  },
  apple: {
    sizes: [180],
  },
  assetName(type, size) {
    const key = `${type}-${size.width}x${size.height}`;

    switch (key) {
      case "transparent-16x16":
        return "favicon-16x16.png";
      case "transparent-32x32":
        return "favicon-32x32.png";
      case "transparent-64x64":
        return "pwa-64x64.png";
      case "transparent-192x192":
        return "pwa-192x192.png";
      case "transparent-512x512":
        return "pwa-512x512.png";
      case "maskable-512x512":
        return "maskable-512x512.png";
      case "apple-180x180":
        return "apple-touch-icon.png";
      default:
        return `${type}-${size.width}x${size.height}.png`;
    }
  },
};

export default defineConfig({
  images: ["public/icons/get2fa.svg"],
  preset,
});
