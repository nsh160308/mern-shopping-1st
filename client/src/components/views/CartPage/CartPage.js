import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react'
import { getCartItems, removeCartItem } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock'
import { Empty } from 'antd';

function CartPage(props) {
    
    const [Total, setTotal] = useState(0)
    //이게 true일때만 가격을 보여준다.
    const [ShowTotal, setShowTotal] = useState(false)

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
                <h2>주문 금액: {Total}원</h2>
            </div>:
            <>
            <br />
            <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={"장바구니가 비었습니다."} 
            />
            </>
            }


            

        </div>
    )
}

export default CartPage
