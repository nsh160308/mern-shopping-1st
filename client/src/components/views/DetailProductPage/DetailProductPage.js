import React, { useEffect, useState } from 'react'
import axios from 'axios';
import ProductInfo from './Sections/ProductInfo';
import ProductImage from './Sections/ProductImage';
import { Row, Col } from 'antd';


function DetailProductPage(props) {

    const productId = props.match.params.productId

    //가져온 상품 데이터를 state로 관리
    const [Product, setProduct] = useState({})

    //console.log('1.props', props)
    //console.log('2.props.match', props.match)
    //console.log('3.props.match.params', props.match.params)

    useEffect(() => {
        console.log('2');
        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])
            })
            .catch(err => alert(err))

    }, [])

    console.log(Product);

    return (
        //UI 만들기
        <div style={{ width: '100%', padding: '3rem 4rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>{Product.title}</h1>
            </div>

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24} >
                    {/* 상품 이미지 */}
                    <ProductImage detail={Product} />
                </Col>

                <Col lg={12} xs={24} >
                    {/* 상품 정보 */}
                    <ProductInfo detail={Product} />
                </Col>
            </Row>
            
        </div>
    )
}

export default DetailProductPage
