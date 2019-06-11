const express = require('express');
const router = express.Router();
const models = require('../models');

const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});

const path = require('path');
const uploadDir = path.join(__dirname, '../uploads/contact');
const fs = require('fs');

const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, uploadDir);
    },
    filename : (req, file, callback) => {
        callback(null, 'contacts-' + Date.now() + '.' + 
            file.mimetype.split('/')[1]
        );
    }
})

const upload = multer({storage: storage});


router.get('/', async(req, res) => {
    try{
        const contacts = await models.Contacts.findAll();
        res.render('contacts/list.html', {contacts});
    }catch(e){
    }
});

router.get('/write', csrfProtection, (req, res) => {
    res.render('contacts/form.html', {csrfToken : req.csrfToken()});
});

router.post('/write', upload.single('thumbnail'), csrfProtection, async(req, res) => {
    try{
        req.body.thumbnail = (req.file) ? req.file.filename : "";
        await models.Contacts.create(req.body);
        res.redirect('/contacts');
    }catch(e){

    }
});

router.get('/delete/:id', async(req, res) =>{
    try{
        await models.Contacts.destroy({
            where : {
                id: req.params.id
            }
        });
        res.redirect('/contacts');
    }catch(e){

    }
})

router.get('/delete/:contact_id/:memo_id', async(req,res) => {
    try{
        await models.ContactsMemo.destroy({
            where : {
                id: req.params.memo_id
            }
        });
        res.redirect(`/contacts/detail/${req.params.contact_id}`);
    }catch(e){
        
    }
})

router.get('/detail/:id', async(req, res) => {
    try{
        const contact = await models.Contacts.findOne({
            where : {
                id : req.params.id
            },
            include : [
                'Memo'
            ]
        });
        console.log(contact);
        res.render('contacts/detail.html', { contact });
    }catch(e){

    }
});

router.post('/detail/:id', async(req, res) => {
    try{
        const contact = await models.Contacts.findByPk(req.params.id);

        await contact.createMemo(req.body);
        res.redirect(`/contacts/detail/${req.params.id}`);
    }catch(e){

    }
})

router.get('/edit/:id', csrfProtection, async(req, res) => {
    try{
        const contact = await models.Contacts.findByPk(req.params.id);
        res.render('contacts/form.html', {
            contact,
            csrfToken : req.csrfToken()
        });
    }catch(e){

    }
});

router.post('/edit/:id', upload.single('thumbnail'), csrfProtection, async(req, res) => {
    try{
        const contact = await models.Contacts.findByPk(req.params.id);

        if(req.file && contact.thumbnail){
            fs.unlinkSync(`${uploadDir}/${contact.thumbnail}`);
        }

        req.body.thumbnail = (req.file) ? req.file.filename : contact.thumbnail;

        await models.Contacts.update(
            req.body,
            {
                where : {
                    id : req.params.id
                }
            }
        );

        res.redirect(`/contacts/detail/${req.params.id}`);
    }catch(e){

    }
})

module.exports = router;