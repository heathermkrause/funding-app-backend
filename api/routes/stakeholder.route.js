const express = require('express');
const { stakeholderController } = require('../controllers');
const ROLES = require('../constants/roles');
const { checkPermission } = require('../middlewares/permission');

const router = express.Router();
router.use(checkPermission([ROLES.ADMIN, ROLES.OWNER, ROLES.USER]));

router
    .route('/')
    .get(stakeholderController.list)
    .post(stakeholderController.create);

router
    .route('/:stakeholderId')
    .get(stakeholderController.read)
    .put(stakeholderController.update)
    .delete(stakeholderController.remove);

router.param('stakeholderId', stakeholderController.getStakeholderByID);

module.exports = { stakeholderRouter: router };
