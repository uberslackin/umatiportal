/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};



/**
 * GET /home-automated
 * Database driven homepage.
 */
exports.homeautomated = (req, res) => {
  res.render('homeautomated', {
    title: 'Home Automated'
  });
};
