const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const ingredientsController = require('../controllers/ingredients');
const verify = require('../routes/verifyToken');


router.get('/user/connectedUser/', verify, userController.connectedUser);
router.get('/user/current/reset', verify, userController.reset);


router.post('/user/addCarbs', verify, userController.addCarb);
router.post('/user/register', userController.create);
router.post('/user/login', userController.login);

router.get('/ingredients', ingredientsController.index);
router.get('/ingredients/delete/:_id', ingredientsController.delete);
router.post('/ingredients/create', ingredientsController.create);


module.exports = router;
