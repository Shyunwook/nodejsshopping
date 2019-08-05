const { Router } = require('express');
const router = Router();
const ctrl = require('./contacts.ctrl');
const paginate = require('express-paginate');
const csrfProtection = require('../../middleware/csrf');

const loginRequired = require('../../middleware/loginRequired');
const upload = require('../../middleware/multer')('contact');

router.get('/', ctrl.get_root);
router.get('/write', csrfProtection, ctrl.get_write);
router.post('/write', upload.single('thumbnail'), csrfProtection, ctrl.post_write);
router.get('/delete/:id', ctrl.get_delete);
router.get('/delete/:contact_id/:memo_id', ctrl.get_delete_memo);
router.get('/detail/:id', ctrl.get_detail);
router.post('/detail/:id', ctrl.post_detail);
router.get('/edit/:id', csrfProtection, ctrl.get_edit);
router.post('/edit/:id', upload.single('thumbnail'), csrfProtection, ctrl.post_edit);

module.exports = router;

