import express from 'express';
import { engine } from 'express-handlebars';
import 'dotenv/config';
import sitemap from 'express-sitemap';
import ViteExpress from 'vite-express';

const app = express();
const port = 3000;
const pagesFolder = 'pages/';
const mode = process.env.NODE_ENV || 'development';

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

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

  res.render(`${pagesFolder}home`, {
    videos: data?.data,
  });
});

app.get('/video/:slug', async (req, res) => {
  const data = await getData(`/videos/search?slug=${req.params.slug}`);

  res.render(`${pagesFolder}detail`, {
    ...data?.data,
  });
});

app.get('/sitemap.xml', async (req, res) => {
  const sitemap = await generateSitemap();
  sitemap.XMLtoWeb(res);
});

if (mode === 'production') {
  app.enable('view cache');
  ViteExpress.config({ mode: 'production' });
}

ViteExpress.listen(app, port, () => {
  console.log(`Server is listening to http://localhost:${port}`);
});
