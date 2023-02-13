const express = require("express");

const router = express.Router();
const Goods = require("../schemas/goods.js");
const Cart = require("../schemas/cart.js");
const authMiddleware = require("../middlewares/auth_middlesare")
const { exists } = require("../schemas/goods.js");

// /routes/goods.js



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





//장바구니 조회
router.get("/goods/cart", authMiddleware, async (req, res) => {
  const {userId} = res.locals.user;
  const carts = await Cart.find({userId : userId});
  
  const goodsIds = carts.map((cart) => {return cart.goodsId});

  const goods = await Goods.find({ goodsId: goodsIds });

  const results = carts.map((cart) => {
		return {
			quantity: cart.quantity,
			goods: goods.find((item) => item.goodsId === cart.goodsId)
		};
  });

  res.json({
    carts: results,
  });
});



  router.post("/goods/:goodsId/cart", authMiddleware, async(req,res) =>{
    const {userId} = res.locals.user;
    const {goodsId} = req.params;
    const {quantity} = req.body;

    const existsCarts = await Cart.find({userId, goodsId});
    if(existsCarts.length){
        return res.status(400).json({
        success:false,
        errorMessage:"이미 장바구니에 해당상품이 존재합니다.",
        });
    };

    await Cart.create({userId, goodsId,quantity});

    res.json({result:"success"});
  })


  router.put("/goods/:goodsId/cart",authMiddleware, async (req,res) => {
    const {userId} = res.locals.user;
    const {goodsId} = req.params;
    const {quantity} = req.body;

    const existsCarts = await Cart.find({userId, goodsId})
    if(existsCarts.length){
        await Cart.updateOne(
            {userId, goodsId: goodsId},
            {$set:{quantity:quantity}}
        )
    }
    res.status(200).json({success:true});
  })


  router.delete("/goods/:goodsId/cart",authMiddleware, async (req,res)=>{
    const {userId} = res.locals.user;
    const {goodsId} = req.params;

    const existsCarts = await Cart.find({userId, goodsId});
    if(existsCarts.length){
        await Cart.deleteOne({userId, goodsId});
    };

    res.json({result: "success"});

  })



module.exports = router;