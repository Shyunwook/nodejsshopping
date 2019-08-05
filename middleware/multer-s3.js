const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const path = require('path');

const dotenv = require('dotenv');
dotenv.config(); // LOAD CONFIG

const uuidv1 = require('uuid/v1');
 
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY, 
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
})
 
const upload = multer({
    
    // 이미지 파일이 아니면 짜른다
    fileFilter: function ( _ , file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('허용되지 않는 파일형식 저장'))
        }
        callback(null, true)
    },

    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET,

        // 저장되는 방식 : org/단체 ID/날짜명 group명
        key: function (req, file, cb) {
            cb(null, 
                req.params.group + '/' + req.params.id + '/'
                + uuidv1() +'.'+ file.mimetype.split('/')[1] )
        },
        acl: 'public-read'
    })

})



module.exports = upload;