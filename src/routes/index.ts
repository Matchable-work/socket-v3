import { Router } from 'express';
import health from './health.route';

const router = Router();

// ✅ Root welcome page
router.get('/', (_req, res) => {
    res.render('welcome'); // will render views/welcome.ejs
});

// Other routes
router.use('/admin', health);

export default router;
