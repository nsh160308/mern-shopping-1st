import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Icon, Col, Row, Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from './../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import { continents, price } from './Sections/Datas'
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';

function LandingPage() {
    //백엔드에서 가져온 데이터를 useState를 이용해서 state에 저장한다.
    const [Products, setProducts] = useState([])
    //SKIP
    const [Skip, setSkip] = useState(0)
    //LIMIT
    const [Limit, setLimit] = useState(8)
    //PostSize
    const [PostSize, setPostSize] = useState(0)
    //Filters
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })
    //SearchTerm
    const [SearchTerm, setSearchTerm] = useState("")


    //React Hooks
    //useEffect는 react에서 가져온다.
    //db에 있는 정보들을 가져와달라고 요청한다.(axios)
    useEffect(() => {
        

        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body);
        
    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                if(response.data.success) {
                    //console.log(response.data);
                    if(body.loadMore) {
                        //console.log(response.data.productInfo);
                        setProducts([...Products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo);
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert(" 상품정보를 가져오는데 실패했습니다. ")
                }
            })
    }



    const loadMoreHandler = () => {
        let skip = Skip + Limit
        //          0   +  8


        //loadMore
        //더보기 버튼을 눌렀을때라는 
        //정보라는 것을 알기위해서 넣어줌
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(body)

        //이걸 해줘야 다음 더보기를 눌렀을때 업데이트된 SKIP을 Limit
        //과 더해서 다음 정보들을 가져올 것이다.
        setSkip(skip)
    }


    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} sm={16} xs={24} key={index}>
            <Card
            //해당 path에 맞는 컴포넌트를 만들어줘야된다. 
                cover={ <a href={`/product/${product._id}`}><ImageSlider images={product.images} /></a>  }
            > 
                <Meta
                    title={product.title}
                    description={`${product.price}원`}
                /> 
            </Card>
        </Col>
    })

    const showFilterResult = (filters) => {

        console.log('filters', filters);

        //체크할 때 마다 처음부터 다시 찾아야 되니까 skip은 0이되어야 한다.
        let body = {
            skip: 0,
            limit: Limit,
            filters : filters
        }

        getProducts(body)
        setSkip(0)

    }


    const handlePrice = (value) => {
        const data = price;//Datas.js
        let array = [];//빈 배열

        for (let key in data) {
            //price배열의 key번째 _id가 넘어온 value와 같다면
            if(data[key]._id === parseInt(value, 10)) {
                array = data[key].array
            }
        }


        return array;
    }




    //두번째 인자는 필터를 두개로 나눠주기 위해서
    //category라는 이름으로 인자를 받는다.
    //filters는 CheckBox.js에서 Checked State가 들어온다.
    const handleFilters = (filters, category) => {
        
        console.log('filters', filters);

        console.log('category', category);

        const newFilters = { ...Filters }

        console.log('Before_newFilters', newFilters);

        //newFilters.category === Filters객체의 continents배열이나 price배열
        //newFilters.category = filters
        //[] = 문자열로 프로퍼티 찾는다
        //. = 이름그대로의 프로퍼티를 찾는다
        //결론적으로 category안에 문자열이 들어있으니
        //대괄호 표기법은 "continents"프로퍼티를 찾는것이고
        //점 표기법은 newFilters의 category그 자체의 프로퍼티를
        //찾게된다.
        newFilters[category] = filters;
        
        console.log('newFilters', newFilters);


        if( category === "price" ) {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }




        //새로운 함수하나 생성
        showFilterResult(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0);
        
        setSearchTerm(newSearchTerm);

        getProducts(body)

    }

    return (
        <div style={{ width: '65%', margin: '3rem auto' }}>

            <div style={{ textAlign: 'center' }}>
                <h2>누구든지 여행을 떠날 수 있어요!<Icon type="rocket" /> </h2>
            </div>
            
            <br />
        
            {/* 필터 */}
            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24} >
                    {/* CheckBox */}
                    <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")}/>
                </Col>
                <Col lg={12} xs={24} >
                    {/* RadioBox */}
                    <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")}/>
                </Col>
            </Row>

            {/* 검색 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                <SearchFeature
                    refreshFunction={updateSearchTerm} />
            </div>

            {/* 카드 */}
            <Row gutter={[16,16]}>
            
            {renderCards}
            
            </Row>

            <br />

            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }
        </div>
    )
}

export default LandingPage
