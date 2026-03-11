import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: false,
  env: {
    APP_VERSION: process.env.npm_package_version,
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // Убрать все логи при билде
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `
      @use "@/styles/global/vars.scss" as *;
      @use "@/styles/global/mixins.scss" as *;
      @use "@/styles/global/funcs.scss" as *;
    `,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Добавляем поддержку импорта MD файлов
  turbopack: {
    rules: {
      '*.md': {
        loaders: ['raw-loader'], // Используем установленный raw-loader
        as: '*.js',
      },
    },
  },

};

export default nextConfig;
