var p1 = new Promise((resolve, reject) => {
    console.log('p1 프라미스 함수제작');
    setTimeout(() => {
        resolve({p1 : "p1의 결과!!!"});
    }, 2000);
    console.log('내부!');
});

var p2 = new Promise((resolve, reject) => {
    console.log('p2 프라미스 함수제작');
    setTimeout(() => {
        resolve({p2 : "p2의 결과!!!"});
    }, 10000);
})


// p1.then((result) => {
//     console.log(result.p1);
//     return p1;
// }).then((result) => {
//     console.log(result);
// })