const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../controllers/middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/createPost', authenticate, authController.createPost);
router.post('/likePost', authenticate, authController.likePost);
router.post('/commentPost', authenticate, authController.commentPost);
router.post('/votePost', authenticate, authController.votePost);

module.exports = router;