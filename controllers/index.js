const { Router } = require('express');
const router = Router()

router.use('/', require('./home'));
router.use('/accounts', require('./accounts'));
router.use('/admin', require('./admin'));
router.use('/contacts', require('./contacts'));
router.use('/auth', require('./auth'));
router.use('/chat', require('./chat'));
router.use('/products',  require('./products'));
router.use('/cart',  require('./cart'));
router.use('/checkout',  require('./checkout'));
router.use('/user',  require('./user'));

module.exports = router;