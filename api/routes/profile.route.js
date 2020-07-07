const express = require('express');
const { profileController } = require('../controllers');
const ROLES = require('../constants/roles');
const { checkPermission } = require('../middlewares/permission');

const router = express.Router();

router.use(checkPermission([ROLES.ADMIN, ROLES.OWNER, ROLES.USER]));

router
  .route('/:userId')
  .get(profileController.read)
  .put(profileController.update)
  .delete(profileController.remove);

router.param('userId', profileController.getUserByID);

module.exports = { profileRouter: router };
