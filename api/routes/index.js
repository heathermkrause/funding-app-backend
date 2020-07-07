const { authRouter } = require('./auth.route');
const { restaurantRouter } = require('./restaurant.route');
const { stakeholderRouter } = require('./stakeholder.route');
const { userRouter } = require('./user.route');
const { connectionRouter } = require('./connection.route');
const { projectRouter } = require('./project.route');
const { profileRouter } = require('./profile.route');
const { csvRouter } = require('./csv.route');

module.exports = {
  authRouter,
  restaurantRouter,
  userRouter,
  stakeholderRouter,
  connectionRouter,
  projectRouter,
  profileRouter,
  csvRouter
};
