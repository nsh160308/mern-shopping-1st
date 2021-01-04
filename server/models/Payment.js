const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = mongoose.Schema({
    user: {
        type: Array,
        default: [],
    },
    data: {
        type: Array,
        default: [],
    },
    product: {
        type: Array,
        default: []
    }
},{ timestamps: true })

//첫번째 인자로 지정한 이름이 내 DB 컬렉션의 이름+s로 생성된다.
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment }