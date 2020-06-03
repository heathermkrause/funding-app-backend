const express = require('express');
const { connectionController } = require('../controllers');
const ROLES = require('../constants/roles');
const { checkPermission } = require('../middlewares/permission');

const router = express.Router();
router.use(checkPermission([ROLES.ADMIN, ROLES.OWNER, ROLES.USER]));

router
    .route('/')
    .get(connectionController.list)
    .post(connectionController.create);

router
    .route('/:connectionId')
    .get(connectionController.read)
    .put(connectionController.update)
    .delete(connectionController.remove);
    
router.param('connectionId', connectionController.getConnectionByID);

module.exports = { connectionRouter: router };
