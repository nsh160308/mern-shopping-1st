import React, { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery';//이미지 애니메이션 관련 라이브러리


function ProductImage(props) {

    //console.log(props.detail);

    const [Images, setImages] = useState([])

    useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0) {
            let images = [];

            props.detail.images.map((item) => (
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            ))

            setImages(images)
        }
    }, [props.detail])

    return (
        <div>
            <ImageGallery items={Images} />
        </div>
    )
}

export default ProductImage
