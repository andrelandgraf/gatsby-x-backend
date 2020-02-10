const { Router } = require('express');
const { obtainToken, resetPwToken } = require('../controllers/auth');

const router = Router();
router.post('/token', obtainToken);
router.put('/token', resetPwToken);

module.exports = router;
