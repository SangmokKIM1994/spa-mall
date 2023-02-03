// function add(a, b) {
//     return a+b;
// }

// module.exports = add

// 모듈을 내보내주는것 !


//모듈을 호출했으 때, add 키값에는 add변수함수가 가지고 있는값이 할당된다.
// const add = (a,b) => {
//     return a+b;
// }

// exports.add = add;

// exports.add = function (a,b) {
//     return a+b;
// }

// console.log(add.add(10,30))<< 이런식으로 불러와야됨
//객체로서 내보내기때문에
//const {add} << 이렇게 중괄호를 씌우면 똑같이 콘솔로그로 찍힘

// function add(a, b) {
//     return a+b;
// }

// 이렇게 써도 2번째랑 똑같이 호출해야됨
// 모듈을 호출했을 때 , add 키 값에는 add 함수가 들어가는 방법
// module.exports = {add: add}

//모듈 그 자체를 바로 add 함수를 할당한다.
// module.exports = add;
