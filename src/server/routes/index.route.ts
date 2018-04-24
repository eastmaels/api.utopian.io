import * as express from 'express';
import {requireAuth, requireAPIKey, requireValidOrigin} from './middleware';

import userRoutes from './user.route';
import postRoutes from './post.route';
import sponsorRoutes from './sponsor.route';
import moderatorRoutes from './moderator.route';
import statsRoutes from './stats.route';
import projectRoutes from './project.route';
import loginRoutes from './login.route';
import logoutRoutes from './logout.route';
import sc2Routes from './sc2.route';
import socialLoginRoutes from './social_login.route';
import tableRoutes from './tables.route';
import faqRoutes from './faq.route';
import ruleRoutes from './rule.route';
import uploadRoutes from './upload.route';
import apikeyRoutes from './key.route';
import notificationsRoutes from './notifications.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
    res.json({status:'OK'})
);

// mount user routes at /users
router.use('/users', requireAPIKey, userRoutes);

router.use('/login', loginRoutes);

router.use('/logout', requireAuth, logoutRoutes);

router.use('/sc2', requireAuth, requireAPIKey, sc2Routes);

router.use('/projects', requireAPIKey, projectRoutes);

router.use('/posts', requireAPIKey, postRoutes);

router.use('/stats', requireAPIKey, statsRoutes);

router.use('/sponsors', requireAPIKey, sponsorRoutes);

router.use('/moderators', requireAPIKey, moderatorRoutes);

router.use('/tables', tableRoutes);

router.use('/auth', requireAPIKey, socialLoginRoutes);

router.use('/faq', requireAPIKey, faqRoutes);

router.use('/rules', requireAPIKey, ruleRoutes)

router.use('/upload', uploadRoutes);

router.use('/apikey', apikeyRoutes);

router.use('/notifications', notificationsRoutes);

export default router;
