import dotenv from 'dotenv'
dotenv.config()

export const fetchRandomAvatar = () => {
  const size = Math.floor(Math.random() * 100) + 25;
  const url = `${process.env.AVATAR_URL}${size}/${size}`;
  return url;
};

