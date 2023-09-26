// Essential module imports for the configuration
const path = require('path');
const htmlmin = require('html-minifier');
const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite');
// const { VitePWA } = require('vite-plugin-pwa');
// const glslifyPlugin = require('vite-plugin-glslify').default;

module.exports = function (eleventyConfig) {
  eleventyConfig.setServerOptions({
    port: 3000,
  });

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: '.11ty-vite',
    viteOptions: {
      publicDir: 'public',
      root: './',
      appType: 'mpa',
      clearScreen: false,
      server: {
        mode: 'development',
        middlewareMode: true,
      },
      build: {
        mode: 'production',
      },
      // plugins: [
      //   // PWA (Progressive Web App) settings using VitePWA plugin
      //   VitePWA({
      //     injectRegister: 'script',
      //     registerType: 'autoUpdate',
      //     includeAssets: [],
      //     workbox: {
      //       globPatterns: ['**/*.{js,css,html,png,jpg,svg,woff,woff2}'],
      //     },
      //   }),
      //   // GLSL (OpenGL Shading Language) support using glslifyPlugin
      //   glslifyPlugin(),
      // ],

      // Module resolve options
      // resolve: {
      //   // Create alias for directories, simplifying import paths
      //   alias: {
      //     '@styles': path.resolve('.', '/src/styles'),
      //     '@app': path.resolve('.', '/src/app'),
      //     '@utils': path.resolve('.', '/src/app/utils'),
      //     '@components': path.resolve('.', '/src/app/components'),
      //     '@shaders': path.resolve('.', '/src/app/shaders'),
      //     '@classes': path.resolve('.', '/src/app/classes'),
      //     '@animations': path.resolve('.', '/src/app/animations'),
      //     '@pages': path.resolve('.', '/src/app/pages'),
      //     '@canvas': path.resolve('.', '/src/app/components/Canvas'),
      //   },
      // },
    },
  });

  // Specify directories and files that should bypass Eleventy's processing and be copied "as-is"
  eleventyConfig.addPassthroughCopy('public');
  eleventyConfig.addPassthroughCopy('app');
  eleventyConfig.addPassthroughCopy('styles');
  eleventyConfig.setServerPassthroughCopyBehavior('copy');

  // Minify HTML
  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.html')) {
      const minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  return {
    dir: {
      input: 'views',
      output: 'dist',
      layouts: 'layouts',
      includes: 'partials',
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: 'njk',
  };
};
