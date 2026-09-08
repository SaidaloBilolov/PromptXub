const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// In-memory User Store / Database Model
const usersDb = new Map();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://prompt-xub.vercel.app/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const googleId = profile.id;
        const displayName = profile.displayName || profile.name?.givenName || 'User';
        const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

        let user = usersDb.get(googleId);

        if (!user) {
          user = {
            id: googleId,
            googleId: googleId,
            name: displayName,
            email: email,
            avatarUrl: avatarUrl,
            provider: 'Google',
            createdAt: new Date().toISOString(),
          };
          usersDb.set(googleId, user);
        } else {
          // Update profile details if changed
          user.name = displayName;
          user.email = email;
          user.avatarUrl = avatarUrl;
          user.updatedAt = new Date().toISOString();
          usersDb.set(googleId, user);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  const user = usersDb.get(id);
  if (user) {
    done(null, user);
  } else {
    done(new Error('User not found in session'), null);
  }
});

module.exports = passport;
