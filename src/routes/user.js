const { Router } = require('express');
const { checkAuthentication } = require('../middlewares/auth');
const { register, changePassword, getMe } = require('../controllers/user');

const router = Router();

router.post('/', register);

router.put('/me/password', checkAuthentication, changePassword);
router.get('/me', checkAuthentication, getMe);

module.exports = router;
