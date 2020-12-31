const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
        
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res) => {
    
    //먼저 User Collection에 유저 정보를 가져오기
    User.findOne({ _id: req.user._id },
        (err, userInfo) => {
            //이미 카트 안에 내가 추가한 상품이 있는지 확인하기
            let duplicate = false;
            userInfo.cart.forEach((item) => {
                if(item.id === req.body.productId) {
                    duplicate = true;
                }
            })
            //상품이 있을 때
            if(duplicate) {
                User.findOneAndUpdate(
                    { _id: req.user._id , "cart.id": req.body.productId },
                    { $inc: { "cart.$.quantity": 1 }},
                    { new: true},//업데이트된 정보를 받기 위해서 무조건 필요한 옵션
                    (err, userInfo) => {
                        if(err) return res.status(400).json({ success: false, err })
                        res.status(200).json(userInfo.cart)
                    }
                )
            } 
            //상품이 있지 않을 때
            else {
                User.findOneAndUpdate(
                    { _id: req.user._id},
                    {
                        $push: {
                            cart: {
                                id: req.body.productId,
                                quantity: 1,
                                date: Date.now(),
                            }
                        }
                    },
                    { new: true },
                    (err, userInfo) => {
                        if(err) return res.status(400).json({ success: false, err })
                        res.status(200).json(userInfo.cart)
                    }
                )
            }
        })
});


//넣을때는 $push 지울떄는 $pull
router.get('/removeFromCart', auth, (req, res) => {
    console.log("/removeFromCart router실행");
    //먼저 cart안에 내가 지우려고 한 상품을 지운다.
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$pull":
            { "cart": {"id": req.query.id }}
        },
        { new: true },
        (err, userInfo) => {
            //product collection에서 현재 남아있는 상품들의 정보를 가져오기
            let cart = userInfo.cart

            console.log('userInfo', userInfo);

            console.log('cart', cart);

            let array = cart.map(item => {
                return item.id
            })

            Product.find({ _id: { $in: array }})
            .populate("writer")
            .exec((err, productInfo) => {
                return res.status(200).json({
                    productInfo,
                    cart
                })
            })
        }
        )





    


})
module.exports = router;
