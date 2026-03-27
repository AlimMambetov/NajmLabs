import type { NextConfig } from "next";
import path from 'path';

const globalStyles = ['vars', 'funcs', 'mixins', 'media', 'colors'];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: false,
  env: {
    APP_VERSION: process.env.npm_package_version,
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },


  compiler: {  // Убрать все логи при билде
    removeConsole: process.env.NODE_ENV === 'production',
  },

  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: globalStyles
      ?.map(file => `@use "@/styles/global/${file}.scss" as *;`)
      .join('\n'),
  },

  images: {
    formats: ['image/avif', 'image/webp'],
  },


  turbopack: {
    rules: {
      '*.md': {  // Добавляем поддержку импорта MD файлов
        loaders: ['raw-loader'], // Используем установленный raw-loader
        as: '*.js',
      },
    },
  },

};

export default nextConfig;
