const { Router } = require('express');
const { checkAuthentication } = require('../middlewares/auth');
const { onPurchaseCompleted, checkout } = require('../controllers/purchase');

const router = Router();

router.post('/items/:id', checkAuthentication, checkout);
router.post('/stripe/webhook', onPurchaseCompleted);

module.exports = router;
