import { timeout } from 'async'
import React from 'react'

function HistoryPage(props) {

    return (
        <div style={{ width: '80%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h1>결제 내역</h1>
            </div>
            <br />

            <table>
                <thead>
                    <tr>
                        <th>주문번호</th>
                        <th>가격</th>
                        <th>개수</th>
                        <th>주문날짜</th>
                    </tr>
                </thead>

                <tbody>

                    {props.user.userData && 
                    props.user.userData.history.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>$ {item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.dataOfPurchase}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}

export default HistoryPage
