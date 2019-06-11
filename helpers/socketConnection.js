require('./removeByValue')();

module.exports = (io) => {

    let userList = []; //사용자 리스트를 저장할 곳

    io.on('connection', (socket) => {

        //아래 두줄로 passport의 req.user의 데이터에 접근한다.
        const session = socket.request.session.passport;
        const user = (typeof session !== 'undefined') ? (session.user) : "";

        // userList 필드에 사용자 명이 존재하지 않으면 삽입
        if(!userList.includes(user.displayname)){
            userList.push(user.displayname);
        }
        io.emit('join', userList);

        socket.on('client message', (data) => {
            io.emit('server message', {
                message : data.message,
                displayname : user.displayname
            });
        });

        socket.on('disconnect', () => {
            userList.removeByValue(user.displayname);
            io.emit('leave', userList);
        })
    })
}