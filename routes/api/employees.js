const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(statesController.getAllStates)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), statesController.createNewState)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), statesController.updateState)
    .delete(verifyRoles(ROLES_LIST.Admin), statesController.deleteState);

router.route('/:id')
    .get(statesController.getState);

module.exports = router;