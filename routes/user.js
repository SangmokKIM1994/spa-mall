const express = require("express");
const { route } = require("./goods");
const router = express.Router();
const UserSchema = require("../schemas/user.js") //스키마를 들고 왔어야 하는데 안들고옴
const authMiddleware = require("../middlewares/auth_middlesare.js")


//내가 노션기능만 보고 작성한 회원가입 api
// router.post("/users", async(req,res) => {
//     const {email,nickname,password,confirmPassword} =req.body

//     if(password !== confirmPassword){
//         res.status(400).json({errorMassege :"비밀번호확인이 일치하지 않습니다."})
//     }

//     const findEmail = await users.find(email)
//     if(findEmail){
//         res.status(400).json({errorMassege :"이미 존재하는 Email입니다"})
//     }

//     const findNickname = await users.find(nickname)
//     if(findNickname){
//         res.status(400).json({errorMassege :"이미 존재하는 Nickname입니다"})
//     }

//     const join = create.user({email,nickname,password})
//     res.status.json({massege:'회원가입이 완료되었습니다.'})
// })


//회원가입 api
router.post("/users", async(req,res) => {
    const {email,nickname,password,confirmPassword} =req.body

    if(password !== confirmPassword){
        res.status(400).json({errorMessage :"비밀번호확인이 일치하지 않습니다.",})
        return
    }

    // email,nickname이 실제로 DB에 존재하는지 확인
    const findEmail = await UserSchema.findOne({
        $or: [{email}, {nickname}],//이메일 또는 닉네임이 일치할 때, 조회한다.
    })
    if(findEmail){
        res.status(400).json({errorMessage :"이메일 또는 닉네임이 이미 사용중입니다.",})
                                                            //반점을 안찍으면 인식이 안된다.
        return
    }

    const user = new UserSchema({email,nickname,password});
    await user.save();
    res.status(201).json({});
})

router.get("/users/me", authMiddleware, async (req,res) => {
    const {email, nickname} = res.locals.user;

    res.status(200).json({
        user: {
            email: email,
            nickname: nickname,
        }
    });
});




module.exports = router