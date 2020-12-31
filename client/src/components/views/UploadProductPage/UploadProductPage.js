import React, { useState } from 'react'
import { Button, Form, Input } from 'antd';
import FileUpload from './../../utils/FileUpload';
import axios from 'axios';
/*
Typography => 제목, 본문, 목록 등을 포함한 기본 텍스트 작성
*/
const { TextArea } = Input;

const Continents = [
    {key: 1, value: "아프리카"},
    {key: 2, value: "유럽"},
    {key: 3, value: "아시아"},
    {key: 4, value: "북 아메리카"},
    {key: 5, value: "남 아메리카"},
    {key: 6, value: "호주"},
    {key: 7, value: "남극"}
]

function UploadProductPage(props) {

    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState(0)
    const [Continent, setContinent] = useState(1)
    const [Images, setImages] = useState([])//이미지업로드를 위한 state

    const titleChangeHandler = (event) => {
        setTitle(event.target.value);
    }

    const descriptionChangeHandler = (event) => {
        setDescription(event.target.value);
    }

    const priceChangeHandler = (event) => {
        setPrice(event.target.value);
    }

    const continentChangeHandler = (event) => {
        setContinent(event.target.value);
    }

    //FileUpload state에 저장된 이미지 정보를 파라미터로 받을거다.
    const updateImages = (newImages) => {
        setImages(newImages);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        console.log('click');

        //간단한 유효성 체크 (모든 칸이 채워지지 않으면 submit 불가능)
        if(!Title || !Description || !Price || !Continent || !Images) {
            return alert(" 모든 값을 채워주세요! ");
        }

        //서버에 채운 값들을 request로 보낸다.
        const body = {
            //현재 로그인된 사람의 ID를 가져오려면 어떻게 해야될까?
            writer: props.user.userData._id,
            title: Title,
            description: Description,
            price: Price,
            continents: Continent,
            images: Images
        }

        console.log('2');
        axios.post("/api/product",body)
            .then(response => {
                if(response.data.success) {
                    alert("상품 업로드에 성공했습니다.")
                    props.history.push('/')
                } else {
                    alert("상품 업로드에 실패했습니다.")
                }
            })

    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto'}}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2> 여행 상품 업로드 </h2>
            </div>

            <Form>
                {/* 드랍 존 */}
                <FileUpload refreshFunction={updateImages}/>


                <br />
                <br />
                <label>이름</label>
                <Input onChange={titleChangeHandler} value={Title} />
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={descriptionChangeHandler} value={Description}/>
                <br />
                <br />
                <label>가격(원)</label>
                <Input type="number" onChange={priceChangeHandler} value={Price}/>
                <br />
                <br />
                <select onChange={continentChangeHandler} value={Continent}>
                    {Continents.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                <br />
                <br />
                <Button onClick={submitHandler}>
                    확인
                </Button>
            </Form>
        </div>

    )
}

export default UploadProductPage
