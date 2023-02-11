const jwt = require('jsonwebtoken');
const User = require("../schemas/user.js")

module.exports = async (req, res, next) =>{
    const {Authorization} = req.cookies;
    const [authType, authToken] = (Authorization ?? "").split(" ")
                                //언디파인일떄 빈문자열을 준다.

    //authType === Bearer값인지 확인
    //authToken 검증
    if(authType !== "Bearer" || !authToken){
        res.status(400).json({
            errorMassage: "로그인 후에 이용할 수 있는 기능입니다."
        });
        return;
    }

 
    
    //jwt검증을 여기다가 하면은 멈추게됨

    try{
        //authToken이 만료되었는지 확인
        //authToken이 서버가 발급한 토근이 맞는지 검증
        const {userId} = jwt.verify(authToken,"customized-secret-key");

        //authToken에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인
        const user = await User.findById(userId);
        res.locals.user = user

        next(); //미들웨어 다음으로 보낸다.
    } catch (error) {
        console.error(error);
        res.status(400).json({errorMassage:"로그인 후에 이용할 수 있는 기능입니다."});
        return
    }


}