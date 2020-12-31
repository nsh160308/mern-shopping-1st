const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    //product를 등록한 사람
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //이름
    title: {
        type: String,
        maxlength: 50
    },
    //설명
    description: {
        type: String,
    },
    //가격
    price: {
        type: Number,
        default: 0
    },
    //이미지
    images: {
        type: Array,
        default: []
    },
    //대륙
    continents: {
        type: Number,
        default: 1
    },
    //몇개가 팔렸는지에 대한 정보가 이 곳에 담긴다.
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },
    //사람들이 얼마나 봤나에 대한 정보가 담긴다.
    views: {
        type: Number,
        default: 0
    }
},{ timestamps: true })

productSchema.index({
    title: 'text',
    description: 'text'
}, {
    weights: {
        title: 5,
        description: 1
    }
})


//첫번째 인자로 지정한 이름이 내 DB 컬렉션의 이름+s로 생성된다.
const Product = mongoose.model('Product', productSchema);

module.exports = { Product }