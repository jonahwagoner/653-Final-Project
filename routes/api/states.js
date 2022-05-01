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

router.route('/:code')
    .get(statesController.getState);

router.route('/:code/capital')
    .get(statesController.getStateCapital);

router.route('/:code/nickname')
    .get(statesController.getStateNickname);

router.route('/:code/population')
    .get(statesController.getStatePopulation);

router.route('/:code/admission')
    .get(statesController.getStateAdmission);

router.route('/:code/funfact')
    .get(statesController.getFunfact);

router.route('/:code/funfact')
    .post(statesController.addFunFact);

module.exports = router;