require('dotenv').config();

const getData = async (url) => {
  const data = await fetch(`${process.env.API_BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });
  const json = await data.json();

  return json;
};

module.exports = getData;
