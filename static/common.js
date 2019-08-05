function getCookie(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(unescape(document.cookie));
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookieHour( name, value, hours ){   
    var now = new Date();
	var time = now.getTime();
	time += 3600 * 1000 * hours;
	now.setTime(time);
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + now.toUTCString() + ";"   
}

$(document).on( 'click' , '.add_like' , function(e){
    // 주소에 # 붙는것 방지
    e.preventDefault();

    // 부모 요소의 아이디를 가져온다.
    var target_id = $(this).parent().attr('id');

    // 현재 제품의 id 받아옴
    var product_id = $(this).attr('product_id');

    $.ajax({
        url : '/products/like/'+ product_id,
        type : 'post',
    })
    .done(function(){

        $('#' + target_id).html('\
            <a product_id="'+ product_id + '" class="pull-right remove_like" href="#"> \
                <img src="/static/img/likeon.png" width="20" alt=""> \
            </a> \
        ');

    })
    .fail(function(){
        console.log('오류발생');
    })


});

$(document).on( 'click' , '.remove_like' , function(e){
    // 주소에 # 붙는것 방지
    e.preventDefault();

    // 부모 요소의 아이디를 가져온다.
    var target_id = $(this).parent().attr('id');

    // 현재 제품의 id 받아옴
    var product_id = $(this).attr('product_id');

    $.ajax({
        url : '/products/like/'+ product_id,
        type : 'delete',
    })
    .done(function(){

        $('#' + target_id).html('\
            <a product_id="'+ product_id + '" class="pull-right add_like" href="#"> \
                <img src="/static/img/likeoff.png" width="20" alt=""> \
            </a> \
        ');

    })
    .fail(function(){
        console.log('오류발생');
    })


});

// (function(exports){
//     exports.getCookie = function (cname){
//         var name = cname + "=";
//         var decodedCookie = decodeURIComponent(unescape(document.cookie));
//         var ca = decodedCookie.split(';');
//         for(var i = 0; i <ca.length; i++) {
//             var c = ca[i];
//             while (c.charAt(0) == ' ') {
//                 c = c.substring(1);
//             }
//             if (c.indexOf(name) == 0) {
//                 return c.substring(name.length, c.length);
//             }
//         }
//         return "";
//     }

//     exports.setCookieHour = function ( name, value, hours ){   
//         var now = new Date();
//         var time = now.getTime();
//         time += 3600 * 1000 * hours;
//         now.setTime(time);
//         document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + now.toUTCString() + ";"   
//     }
// })(window);

// 사용부
// window.getCookie(param); 
 // -> 변수의 충돌을 피하기 위해 위처럼 즉시실행함수로 감싸고 윈도우 객체의 속성으로 추가해서 사용하면 절대 충돌할 일이 없다
 //위같은 방식을 모듈화라고한다!