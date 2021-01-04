import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react'
import { getCartItems, removeCartItem, onSuccessBuy } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock'
import { Empty, Result } from 'antd';
import Paypal from './../../utils/Paypal';

function CartPage(props) {
    
    const [Total, setTotal] = useState(0)
    //이게 true일때만 가격을 보여준다.
    const [ShowTotal, setShowTotal] = useState(false)
    //성공 관리 state
    const [ShowSuccess, setShowSuccess] = useState(false)

    const dispatch = useDispatch();

    useEffect(() => {
        console.log('useEffect');
        let cartItems = [];

        //Redux User state안에 cart안에 상품이 들어있는지 확인
        if(props.user.userData && props.user.userData.cart) {
            console.log('1');
            if(props.user.userData.cart.length > 0){
                console.log('2');
                props.user.userData.cart.forEach((item) => {
                    cartItems.push(item.id)
                })

                dispatch(getCartItems(cartItems, props.user.userData.cart))
                .then(response => { calculateTotal(response.payload) })
            }

        }
    }, [props.user.userData])


    const calculateTotal = (cartDetail) => {
        let total = 0;

        cartDetail.map(item => {
            total += parseInt(item.price,10) * item.quantity
        })

        console.log(total);
        setTotal(total);
        setShowTotal(true);
    }


    let removeFromCart = (productId) => {
        console.log("removeFormCart실행");

        console.log('productId', productId);

        dispatch(removeCartItem(productId))
            .then(response => {
                if(response.payload.productInfo.length <= 0) {
                    setShowTotal(false)
                }
            })


    }


    const transactionSuccess = (data) => {

        //action에 두가지 정보를 넣어준다.
        //1.Payment Collection에 저장할 정보
        //2.User Collection의 history필드에 저장할 정보
        dispatch(onSuccessBuy({
            paymentData: data, //페이팔 쪽에서 전달해준 정보
            cartDetail: props.user.cartDetail //cartDetail정보
        }))//백엔드 에서 다 처리를하면 response를 준다.
        .then(response => {
            if(response.payload.success) {
                setShowTotal(false)
                setShowSuccess(true)
            }
        })

    }


    console.log('CartPage render');
    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>내 장바구니</h1>
            
            <div>
                {/* props.user.cardDetail.productInfo 에러 생긴이유
                    props.user.cardDetail을 가져오기도 전에 productInfo정보를
                    가져오려고했기 때문에
                */}
                <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart}/>
            </div>

            


            {ShowTotal ? 
            <div style={{ marginTop: '3rem' }}>
                <h2>주문 금액: $ {Total}</h2>
            </div>
            : ShowSuccess ? 
                <Result
                status="success"
                title="주문이 완료되었습니다."
                />
            :
            <>
                <br />
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description={"장바구니가 비었습니다."} 
                />
            </>
            }

            {/* ShowTotal이 있을때만 Paypal 컴포넌트 보이기 */}
            {ShowTotal && 
            
                <Paypal 
                    total={Total}
                    onSuccess={transactionSuccess}
                />}
            


            

        </div>
    )
}

export default CartPage
