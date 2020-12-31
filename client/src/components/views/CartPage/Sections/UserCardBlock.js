import React from 'react'
import "./UserCardBlock.css"

function UserCardBlock(props) {

    const renderCartImage = (images) => {
        if(images.length > 0) {
            let image = images[0]
            
            return `http://localhost:5000/${image}`
        }
    }

    const renderItems = () => {
        let renderItems = (
            props.products && props.products.map((product, index) => (
            <tr key={index}>
                <td>
                    <img style={{ width: '75px', height: '50px' }} alt="product"
                    src={renderCartImage(product.images)} />
                    
                    <div>
                        {product.title}
                    </div>
                </td>
                <td>
                    {product.quantity} 개
                </td>
                <td>
                    {product.price} 원
                </td>
                <td>
                    <button onClick={() => props.removeItem(product._id)}>
                        Remove
                    </button>
                </td>
            </tr>
            ))
        )

        return renderItems;
    }

    
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>이미지</th>
                        <th>개수</th>
                        <th>가격</th>
                        <th>장바구니 빼기</th>
                    </tr>
                </thead>
                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCardBlock
