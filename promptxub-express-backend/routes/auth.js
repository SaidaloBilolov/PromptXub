const express = require('express');
const passport = require('passport');
const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://prompt-xub.vercel.app';

/**
 * @route   GET /auth/google
 * @desc    Initiate Google OAuth 2.0 authentication
 * @access  Public
 */
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

/**
 * @route   GET /auth/google/callback
 * @desc    Google OAuth 2.0 Callback endpoint
 * @access  Public
 */
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Google OAuth Authentication Error:', err);
      return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
    if (!user) {
      console.warn('Google OAuth Authentication Failed - No User Returned');
      return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Session Login Error:', loginErr);
        return res.redirect(`${FRONTEND_URL}/login?error=session_error`);
      }
      // Successful login -> Redirect to /dashboard
      return res.redirect(`${FRONTEND_URL}/dashboard`);
    });
  })(req, res, next);
});

/**
 * @route   GET /logout
 * @desc    Terminate user session and redirect to Home page
 * @access  Private/Public
 */
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return next(err);
    }
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error('Session destroy error:', sessionErr);
      }
      res.clearCookie('connect.sid');
      return res.redirect(`${FRONTEND_URL}/`);
    });
  });
});

/**
 * @route   GET /auth/user
 * @desc    Get current authenticated session user details
 * @access  Public
 */
router.get('/user', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: req.user
    });
  }
  return res.status(401).json({
    authenticated: false,
    message: 'User is not authenticated'
  });
});

module.exports = router;
