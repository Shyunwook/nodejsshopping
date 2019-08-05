const models = require('../../models');

exports.get_root = async(_, res) => {
    try{
        const contacts = await models.Contacts.findAll();
        res.render('contacts/list.html', {contacts});
    }catch(e){

    }
};

exports.get_write = (req, res) => {
    res.render('contacts/form.html', {csrfToken : req.csrfToken()});
};

exports.post_write = async(req, res) => {
    try{
        req.body.thumbnail = (req.file) ? req.file.filename : "";
        await models.Contacts.create(req.body);
        res.redirect('/contacts');
    }catch(e){

    }
};

exports.get_delete = async(req, res) =>{
    try{
        await models.Contacts.destroy({
            where : {
                id: req.params.id
            }
        });
        res.redirect('/contacts');
    }catch(e){

    }
};

exports.get_delete_memo = async(req,res) => {
    try{
        await models.ContactsMemo.destroy({
            where : {
                id: req.params.memo_id
            }
        });
        res.redirect(`/contacts/detail/${req.params.contact_id}`);
    }catch(e){
        
    }
};

exports.get_detail = async(req, res) => {
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
};

exports.post_detail = async(req, res) => {
    try{
        const contact = await models.Contacts.findByPk(req.params.id);

        await contact.createMemo(req.body);
        res.redirect(`/contacts/detail/${req.params.id}`);
    }catch(e){

    }
};

exports.get_edit = async(req, res) => {
    try{
        const contact = await models.Contacts.findByPk(req.params.id);
        res.render('contacts/form.html', {
            contact,
            csrfToken : req.csrfToken()
        });
    }catch(e){

    }
};

exports.post_edit = async(req, res) => {
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
};