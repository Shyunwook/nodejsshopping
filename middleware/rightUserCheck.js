module.exports = (req, res, next) => {
    if(req.params.id != req.user.id){
        res.send('<script>alert("본인 정보만 확인 가능합니다.");\
            location.href="/";</script>');
    }else{
        return next();
    }
}