const express = require("express");

const router = express.Router();

// /routes/goods.js

const Goods = require("../schemas/goods.js");

router.get('/goods', async (req,res) => {
    const {category} = req.query;

    const goods = await Goods.find(category ? {category} : {})
    .sort("-date")//내림차순으로 정렬
    .exec();

    const results = goods.map((item) => {
      return {
        goodsId: item.goodsId,
        name: item.name,
        price: item.price,
        thumbnailUrl: item.thumbnailUrl,
        category: item.category,
      };
    }) ;

    res.status(200).json({goods: results});

});

//상품상세조회 api
router.get('/goods/:goodsId', async (req,res) => {
  const {goodsId} = req.params;

  const goods = await Goods.findOne({goodsId : goodsId})
  .sort("-date")//내림차순으로 정렬
  .exec();

  const result = {
    
      goodsId: goods.goodsId,
      name: goods.name,
      price: goods.price,
      thumbnailUrl: goods.thumbnailUrl,
      category: goods.category,
    };

  res.status(200).json({goods: result});

});


router.post("/goods", async (req, res) => {
	const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });
  if (goods.length) {
    return res.status(400).json({ success: false, 
        errorMessage: "이미 있는 데이터입니다." });
  }

  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

  res.json({ goods: createdGoods });
});


//cart에 대해서 get post put delete


const Cart = require("../schemas/cart.js");

const { exists } = require("../schemas/goods.js");
  router.post("/goods/:goodsId/cart",async(req,res) =>{
    const {goodsId} = req.params;
    const {quantity} = req.body;

    const existsCarts = await Cart.find({goodsId});
    if(existsCarts.length){
        return res.status(400).json({
        success:false,
        errorMessage:"이미 장바구니에 해당상품이 존재합니다.",
        });
    };

    await Cart.create({goodsId,quantity});

    res.json({result:"success"});
  })

  router.put("/goods/:goodsId/cart", async (req,res) => {
    const {goodsId} = req.params;
    const {quantity} = req.body;

    const existsCarts = await Cart.find({goodsId})
    if(existsCarts.length){
        await Cart.updateOne(
            {goodsId: goodsId},
            {$set:{quantity:quantity}}
        )
    }
    res.status(200).json({success:true});
  })

  router.delete("/goods/:goodsId/cart", async (req,res)=>{
    const {goodsId} = req.params;

    const existsCarts = await Cart.find({goodsId});
    if(existsCarts.length){
        await Cart.deleteOne({goodsId});
    };

    res.json({result: "success"});

  })



module.exports = router;