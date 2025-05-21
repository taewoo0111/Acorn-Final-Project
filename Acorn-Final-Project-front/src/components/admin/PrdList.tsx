import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { OrderItem, PrdListProps } from '../../types/OrderType';
import api from '../../api';
import './InvOrdStyle.css';
import {v4 as uuid} from "uuid";

function PrdList({
    setOrderItem,
    clickCnt,
    setClickCnt
}: PrdListProps) {

    // 검색 필터
    const [filterType, setFilterType] = useState('');
    // 검색어
    const [keyword, setKeyword] = useState('');
    // 검색 결과
    const [filteredData, setFilteredData] = useState<OrderItem[]>([]);

    // 검색 버튼 핸들러
    const handleSearch = () => {
        refreshList();
    };

    // 추가 버튼 핸들러
    const handleAdd = (item: OrderItem) => {
        console.log("추가 버튼 클릭",item)
        // 버튼 클릭 횟수 증가
        setClickCnt(clickCnt+1);        
        // 추가할 품목 정보 저장
        setOrderItem({...item});
    }

    // 조건에 맞는 품목 목록 가져오기
    const refreshList = () => {
        let urlPath = '';
        // 품목 아이디로 검색할 경우
        if(filterType === 'pid'){
            urlPath = `/pdt?condition=${filterType}&keyId=${keyword}`
        // 그 외 경우로 검색할 경우
        } else {
            urlPath = `/pdt?condition=${filterType}&keyword=${keyword}`
        }
        // 검색 조건에 맞는 데이터 요청
        api.get(urlPath)
            .then(res => {
                console.log(res.data);
                setFilteredData(res.data.list)
            })
            .catch(err => console.log(err));
    }

    // 컴포넌트 활성화 시
    useEffect(() => {
        refreshList();
    }, []);

    return (
        <>
            {/* <pre>{JSON.stringify(filteredData,null,4)}</pre> */}
            <div className="p-4 bg-gray">
                <h3 className="mb-4 fw-bold text-center">품목 현황</h3>
                <Row className="mb-3">
                    <Col sm="auto">
                        <Form.Select onChange={(e) => setFilterType(e.target.value)} defaultValue={filterType}>
                            <option value="">전체</option>
                            <option value="pname">품목명</option>
                            <option value="pid">품목 코드</option>
                            <option value="ctg">카테고리</option>
                        </Form.Select>
                    </Col>
                    <Col sm>
                        <Form.Control
                            type="text"
                            placeholder="검색어 입력..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </Col>
                    <Col sm="auto">
                        <Button style={{ backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }} onClick={handleSearch}>검색</Button>
                    </Col>
                </Row>

                <div className="table-wrapper-order text-center">
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>추가</th>
                                <th>카테고리</th>
                                <th>품목 코드</th>
                                <th className='col-5'>품목명</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item) => (
                                <tr key={uuid()}>
                                    <td>
                                        <a style={{ cursor: 'pointer', color: 'green' }}
                                            onClick={()=>handleAdd(item)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                            </svg>
                                        </a>
                                    </td>
                                    <td>{item.cdCategory}</td>
                                    <td>{item.productId}</td>
                                    <td>{item.productName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

            </div>
        </>
    );
}

export default PrdList;