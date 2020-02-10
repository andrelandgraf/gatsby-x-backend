const { Router } = require('express');
const { getItems } = require('../controllers/item');

const router = Router();

router.get('/', getItems);

module.exports = router;
