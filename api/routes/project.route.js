const express = require('express');
const { projectController } = require('../controllers');
const ROLES = require('../constants/roles');
const { checkPermission } = require('../middlewares/permission');

const router = express.Router();
router.use(checkPermission([ROLES.ADMIN, ROLES.OWNER, ROLES.USER]));

router
    .route('/')
    .get(projectController.list)
    .post(projectController.create);

router
    .route('/:projectId')
    .get(projectController.read)
    .put(projectController.update)
    .delete(projectController.remove);

router.param('projectId', projectController.getProjectByID);

module.exports = { projectRouter: router };
