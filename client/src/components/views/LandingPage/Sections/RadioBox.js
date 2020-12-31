import React, { useState } from 'react'
import { Collapse, Radio } from 'antd';

const { Panel } = Collapse;


function RadioBox(props) {

    //이 state가 price데이터의 _id이고
    //_id는 0부터 시작하기 때문에 초기 state값은 0이다.
    const [Value, setValue] = useState(0)

    
    const renderRadioBoxList = () => {
        return props.list && props.list.map((value) =>(
            <Radio key={value._id} value={value._id}>
                {value.name}
            </Radio>
        ))
    }

    // Radio에 있는 value값과 Radio.Group에 있는 value값이 같다면
    // 그 것이 체크된 것이기 때문에 onChange이벤트로 그 부분을 제어한다.
    const handleChange = (event) => {
        setValue(event.target.value);
        props.handleFilters(event.target.value)
    }

    //console.log('list',props.list);
    //console.log(Value);
    return (
        <div>
            <Collapse defaultActiveKey={['0']} >
                <Panel header="가격대로 정렬하기" key="1">

                <Radio.Group onChange={handleChange} value={Value}>
                    {renderRadioBoxList()}
                </Radio.Group>
                
                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox
