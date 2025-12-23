module.exports = (req, res) => {
  const headerCountry = req.headers['x-vercel-ip-country'];
  res.status(200).json({ country: headerCountry || '' });
};
