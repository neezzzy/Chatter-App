require('dotenv').config();

const fetchRandomAvatar = () => {
  const size = Math.floor(Math.random() * 100) + 25;
  const url = `${process.env.AVATAR_URL}${size}/${size}`;
  return url;
};

module.exports = fetchRandomAvatar;
