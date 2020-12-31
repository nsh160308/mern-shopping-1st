const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');
//=================================
//            Product
//=================================


//destination: 업로드 된 파일을 저장할 폴더를 결정
//filename: 업로드 된 파일을 어떤 이름으로 저장할지
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

var upload = multer({ storage: storage }).single("file")

//이미 /api/product를 타고서 이 곳으로 온 것이다.
router.post('/image', (req, res) => {
    //가져온 이미지를 저장하면 된다. (multer라이브러리)
    upload(req, res, err => {
        console.log(req.file);
        if(err) {
            //파일을 저장하다가 에러가 났다면
            return res.json({ success: false, err })
        }
        //파일 저장에 성공했으면 클라이언트에게
        //저장한 폴더가 어딘지 저장한 파일 이름이 뭔지를 전달한다.
        return res.json({ success: true, filePath: req.file.path, fileName: req.file.filename })
    })
})

//게시글 업로드
router.post('/', (req, res) => {
    //받아온 정보들을 DB에 넣어 준다.

    //받아온 정보들을 넣어서 새로운 Product모델 객체를 만든다.
    const product = new Product(req.body);

    //넣어준 정보들이 자동적으로 Product콜렉션안에 저장이된다.
    product.save((err) => {
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })
})

//랜딩페이지에서 db에 저장된 모든 상품정보를 가져오기
router.post('/products', (req, res) => {

    //여기서 skip과 limit의 정보를 받아준다.
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let term = req.body.searchTerm
    //더 많은 조건을 택해서 DB에서 가져와야 된다.
    let findArgs = {}; // 빈 객체 정의

    console.log('filters', req.body.filters);

    //랜딩페이지에서 filters라는 것을 body안에 넣어서 가져왔으니까
    //filters는 배열이다.
    for(let key in req.body.filters) {

        console.log('key', key);
        console.log(typeof(key));

        //하나 이상 들어 있으면
        if(req.body.filters[key].length > 0) {

            console.log('key', key);

            if( key === "price") {

                findArgs[key] = {
                    //Greater than equal 지정된 값보다 크거나 같은 문서 선택
                    $gte: req.body.filters[key][0],
                    //Less than equal 지정된 값도가 작거나 같은 문서 선택
                    $lte: req.body.filters[key][1],
                }

            } else {
                
                findArgs[key] = req.body.filters[key];

            }

        }
    }

    console.log('findArgs', findArgs);

    //프론트엔드에서 검색어 값이 있다면
    if(term) {
        Product.find(findArgs)
            .find({ $text: { $search: term }})
            .populate("writer")
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {
                if(err) return res.status(400).json({ success: false, err})
                return res.status(200).json({ 
                    success:true, productInfo,
                    postSize: productInfo.length })
            })
    } else {
        //product 콜렉션에 들어 있는 모든 상품 정보 가져온다.
        //populate: writer의 ObjectId를 이용해서 이 id가 가지고
        //있는 모든 정보를 이용하기위해서 사용한다.
        //polulate("writer") => writer에 대한 모든 정보를 가져올 수 있다.
        Product.find(findArgs)
            .populate("writer")
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {
                if(err) return res.status(400).json({ success: false, err})
                return res.status(200).json({ 
                    success:true, productInfo,
                    postSize: productInfo.length })
            })
    }

})




//id가 여러개이면 type=array
router.get('/products_by_id', (req, res) => {

    let type = req.query.type
    let productIds = req.query.id

    console.log('type', type);
    console.log('productIds', productIds);

    //splice 문자열 => 배열로 변환
    if(type === "array") {
        //id=123132,2323123,1232323 이거를
        //productIds = ['123132','2323123','1232323']이런식으로 바꿔준다.
        let ids = req.query.id.split(',')
        
        productIds = ids;
    }

    //productIds를 이용해서 DB에서 productIds와 같은 상품의 정보를 가져온다.
    Product.find({_id: { $in: productIds } })
        .populate("writer")
        .exec((err, productInfo) => {
            if(err) return res.status(400).json({ success: false, err})
            return res.status(200).send( productInfo )
        })

})

module.exports = router;
