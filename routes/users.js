const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users_controller');
const resetController = require('../controllers/reset_password_controller');
const friendController = require('../controllers/friendship_controller')

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);
router.post('/togg-friend', friendController.togg_friend);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);


router.post('/create', usersController.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'},
), usersController.createSession);

router.get('/sign-out', usersController.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);


// Reset Password
router.get('/forget-password',usersController.forget_email_page);
router.post('/reset',resetController.send_mail);
router.get('/reset_password_page/:id',resetController.reset_password_page);
router.post('/confirm-change/:id',resetController.changePassword);


module.exports = router;