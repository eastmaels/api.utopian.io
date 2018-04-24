import notificationCtrl from '../controllers/notification.controller';
import * as express from 'express';

const router = express.Router();

router.route('/')
  .get(notificationCtrl.list);

export default router;
