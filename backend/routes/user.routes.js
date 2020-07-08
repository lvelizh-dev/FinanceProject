const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.get('/', userController.getUsers)
router.post('/signup', userController.createUser);
router.post('/signin', userController.signin);
router.get('/:id', userController.getUserByID);
router.put('/:id', userController.editUser);
router.delete('/:id', userController.deleteUser);
router.post('/getByType', userController.getUsersByType);




module.exports = router;