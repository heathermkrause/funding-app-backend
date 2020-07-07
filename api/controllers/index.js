const { authController } = require('./auth.controller');
const { restaurantController } = require('./restaurant.controller');
const { reviewController } = require('./review.controller');
const { userController } = require('./user.controller');
const { stakeholderController } = require('./stakeholder.controller');
const { connectionController } = require('./connection.controller');
const { projectController } = require('./project.controller');
const { profileController } = require('./profile.controller');
const { csvController } = require('./csv.controller');

module.exports = {
  authController,
  restaurantController,
  reviewController,
  userController,
  stakeholderController,
  connectionController,
  projectController,
  profileController,
  csvController
};
