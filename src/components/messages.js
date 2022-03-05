const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocation = (
  username,
  { date, latitude, longitude } = googleMapInfo
) => {
  return {
    username,
    date,
    latitude,
    longitude,
  };
};

module.exports = { generateMessage, generateLocation };
