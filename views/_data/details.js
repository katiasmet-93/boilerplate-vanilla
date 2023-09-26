const getData = require('../utils/getData');

const fetchVideos = async () => {
  const data = await getData('/videos');

  return data.data;
};

module.exports = fetchVideos;
