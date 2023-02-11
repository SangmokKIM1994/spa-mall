const express = require("express");
const router = express.Router();
const User = require("../schemas/user.js");
const jwt = require("jsonwebtoken");

//로그인 api 내가 만든거
// router.get("/users", async (req,res) => {
//     const {email,password} = req.body;

//     const findEmail = await User.findOne({email})
//     if(!findEmail){
//         res.status(400).json({errorMessage:"존재하지 않는 아이디 입니다.",})
//         return
//     }
//     const findPassword = await User.findOne({
//         $and: [{email}, {nickname}],
//     })
//     if(!findPassword){
//         res.status(400).json({errorMessage:"비밀번호가 일치하지 않습니다.",})
//     }
    
// })

router.post('/auth', async(req,res) => {
    const {email,password} = req.body;

    //이메일이 일치한 유저를 찾는다
    const check = await User.findOne({email})

    //1. 이메일에 일치하는 유저가 존재안하거나
    //2. 유저를 찾았지만, 유저의 비번이랑 입력한 비번이 다를때
    if(!check || check.password !== password){
                res.status(400).json({errorMessage:"로그인에 실패하였습니다.",})
                return
            }

    // jwt생성
    const token = jwt.sign({userId: check.userId}, "customized-secret-key");

    res.cookie("Authorization", `Bearer ${token}`);
    res.status(200).json({token})

})


module.exports = router