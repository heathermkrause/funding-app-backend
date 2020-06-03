const express = require('express');
const { csvController } = require('../controllers');
const ROLES = require('../constants/roles');
const { checkPermission } = require('../middlewares/permission');

const router = express.Router();
router.use(checkPermission([ROLES.ADMIN, ROLES.OWNER, ROLES.USER]));

router
    .route('/export')
    .get(csvController.export);

module.exports = { csvRouter: router };
