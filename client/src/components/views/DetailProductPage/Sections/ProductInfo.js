import React from 'react'
import { Descriptions, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../_actions/user_actions';



function ProductInfo(props) {

    const dispatch = useDispatch();

    const clickHandler = () => {

        //필요한 정보를 cart 필드에다가 넣어준다.
        //상품에 대한 id
        //개수
        //언제 장바구니에 담았는지에 대한 date
        //Redux로 처리한다. 유저에 관한부분이니까
        dispatch(addToCart(props.detail._id))


    }


    return (
        <div>
            <Descriptions title="상세 정보">
                <Descriptions.Item label="가격">{props.detail.price}</Descriptions.Item>
                <Descriptions.Item label="판매">{props.detail.sold}</Descriptions.Item>
                <Descriptions.Item label="조회">{props.detail.views}</Descriptions.Item>
                <Descriptions.Item label="설명">{props.detail.description}</Descriptions.Item>
            </Descriptions>

            <br />
            <br />
            <br />

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="large" shape="round" type="danger" onClick={clickHandler}>
                    장바구니 담기
                </Button>

            </div>
        </div>
    )
}

export default ProductInfo
