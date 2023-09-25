import express from 'express';
import { create } from 'express-handlebars';
import 'dotenv/config';
import sitemap from 'express-sitemap';
import ViteExpress from 'vite-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const pagesFolder = 'pages/';
const mode = process.env.NODE_ENV || 'development';
const isProd = mode === 'production';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const hbs = create({
  helpers: {
    ifeq(a, b, options) {
      if (a == b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    ifnoteq(a, b, options) {
      if (a != b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
  },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

const getDefaultData = async () => {
  const data = await fs.promises.readFile(`${__dirname}/dist/manifest.json`, 'utf8');
  const manifest = JSON.parse(data);

  return {
    isProd,
    css: manifest['src/main.css'].file,
    js: manifest['src/main.js'].file,
  };
};

const getData = async (url) => {
  const data = await fetch(`${process.env.API_BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });
  const json = await data.json();

  return json;
};

const getVideoSitemap = async () => {
  const today = new Date();
  const data = await getData('/videos');
  const map = {};
  const routes = {};
  data?.data.forEach((item) => {
    map[`/video/${item.slug}`] = ['get'];
    routes[`/video/${item.slug}`] = {
      lastmod: `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`,
      changefreq: 'daily',
      priority: 0.7,
    };
  });

  return { map, routes };
};

const generateSitemap = async () => {
  const today = new Date();
  const { map, routes } = await getVideoSitemap();

  return sitemap({
    url: process.env.BASE_URL,
    map: {
      '/': ['get'],
      ...map,
    },
    route: {
      '/': {
        lastmod: `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`,
        changefreq: 'monthly',
        priority: 1.0,
      },
      ...routes,
    },
  });
};

app.get('/', async (req, res) => {
  const data = await getData('/videos');
  const defaultData = await getDefaultData();

  res.render(`${pagesFolder}home`, {
    ...defaultData,
    videos: data?.data,
  });
});

app.get('/video/:slug', async (req, res) => {
  const data = await getData(`/videos/search?slug=${req.params.slug}`);
  const defaultData = await getDefaultData();

  res.render(`${pagesFolder}detail`, {
    ...defaultData,
    ...data?.data,
  });
});

app.get('/sitemap.xml', async (req, res) => {
  const sitemap = await generateSitemap();
  sitemap.XMLtoWeb(res);
});

ViteExpress.config({ mode });
ViteExpress.listen(app, port, () => {
  console.log(`Server is listening to http://localhost:${port}`);
});
