import React, { useState } from 'react'
import { Collapse, Checkbox } from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {
    
    const [Checked, setChecked] = useState([])

    const handleToggle = (value) => {
        console.log('<handleToggle>',Checked);
        //누른 것의 index를 구한다.
        const currentIndex = Checked.indexOf(value)
        
        console.log('<handleToggle>',currentIndex);
        
        const newChecked = [...Checked]

        console.log('<handleToggle>',newChecked);

        //true면 내가 누른 Checkbox의 value가
        if(currentIndex === -1) {
            //없다면 State 넣어 준다.
            newChecked.push(value)
        //전체 Checked된 State에서 현재 누른 Checkbox가 있다면
        } else { 
            //빼주고
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked)
        props.handleFilters(newChecked)
    }

    const renderCheckboxList = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            {/* 체크박스 컨트롤 방법 */}
            {/* true = 선택 false = 선택x */}
            {/* onChange이벤트가 일어날 때 function트리거 */}
            <Checkbox 
                onChange={() => handleToggle(value._id)} 
                checked={Checked.indexOf(value._id) === -1 ? false : true}/>
            <span>{value.name}</span>
        </React.Fragment>
    ))

    return (
        <Collapse defaultActiveKey={['0']} >
            <Panel header="나라별로 정렬하기" key="1">
                {renderCheckboxList()}
            </Panel>
        </Collapse>
    )
}

export default CheckBox
