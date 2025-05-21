// 타입스크립트 무시
//@ts-nocheck 
import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Container, Form, InputGroup, Pagination, Row, Table } from 'react-bootstrap';
import api from '../../api';
// debounce 함수( 지점 입력 끝났을 때, 한번만 동작)
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function CeoOrder() {
    // 동적 검색조건 상태(지점, 승인상태, 시작~끝 날짜)
    const [searchState, setSearchState] = useState({
        storeName: "",
        cdStatus: "",
        startDate: "",
        endDate: ""
        // orderName: ""
    });

    // 발주자 상태갑 관리
    const [orderName, setOrderName] = useState("");

    // 동적 검색 조건 반영함수
    const handleSearchCnange = (e) => {
        setSearchState({
            ...searchState,
            [e.target.name]: e.target.value

        });
        // 검색 조건 변경 시 무조건 처음 페이지로!
        setPageNum(1);
        console.log(searchState);
    };

    // 발주자 이름 별도 관리
    const handleOrderNameChange = (e) => {
        setOrderName(e.target.value);
    }

    // 발주서 리스트 정보 상태
    const [orderList, setOrderList] = useState({
        list: []
    });

    // 페이징 처리 상태값
    const [pageNum, setPageNum] = useState(1);

    // 페이징 숫자 버튼 출력시 사용하는 배열
    const [pageArray, setPageArray] = useState([]);

    // 페이징 숫자 버튼 클릭시 페이지 이동하기
    const move = (pageNum) => {
        // console.log("함수 호출 여부");
        setPageNum(pageNum);
    }


    // 지점 입력란에 입력하고 0.5초 동안 입력 없으면 요청을 보냄
    const fetchOrderList = _.debounce((updatedState, page) => {
        api.post("/orders", {
            ...updatedState,
            pageNum: page
        })
            .then(res => {
                setOrderList(res.data);
                // console.log(res.data);
                // 페이징 처리 숫자 버튼 생성하기
                const range = _.range(res.data.startPageNum, res.data.endPageNum + 1);
                setPageArray(range);
                // console.log(range);
            })
            .catch(err => console.log("에러", err));
    }, 500);

    useEffect(() => {
        fetchOrderList(searchState, pageNum);

        return () => {
            if (fetchOrderList.cancel) {
                fetchOrderList.cancel();
            }
        };
    }, [searchState, pageNum]);

    // 페이지 숫자 버튼 클릭시 이동하기
    const navigate = useNavigate();

    // 날짜 유효성 검사
    const [dateError, setDateError] = useState(false);

    // 날짜 변경 시 유효성 검사하기
    const handleSearchChange1 = (e) => {
        const { name, value } = e.target;

        const newState = {
            ...searchState,
            [name]: value
        };

        // 유효성 검사: 시작날짜~ 끝날짜 비교
        if (name === "startDate" || name === "endDate") {
            const start = newState.startDate;
            const end = newState.endDate;
            if (start && end && start >= end) {
                setDateError(true);
            } else {
                setDateError(false);
            }
        }
        setSearchState(newState);
        setPageNum(1);
    };

    return (
        <Container>
            <h2 className='my-3'>전체 발주 목록</h2>
            <style>
        {
          `
            .pagination .page-item.active .page-link {
            background-color: #28a745;   /* 초록색 */
            border-color: #28a745;
            color: white;
          }

          `
        }
      </style>
            {/* 검색 필터 */}
            <Row className="align-items-center mb-3">
                {/* 왼쪽: 검색 조건 */}
                <Col md={9}>
                    <Row className="g-2">
                        <Col md={3}>
                            <Form.Control placeholder="지점 입력" onChange={handleSearchCnange} value={searchState.storeName} name='storeName' />
                        </Col>
                        <Col md={2}>
                            <Form.Select onChange={handleSearchCnange} name='cdStatus'>
                                <option value="">전체</option>
                                <option value="PEN">대기</option>
                                <option value="APP">승인</option>
                                <option value="REJ">반려</option>
                            </Form.Select>
                        </Col>
                        <Col md={5} style={{ position: 'relative' }}>
                            {dateError && (
                                <Form.Text style={{
                                    color: 'red',
                                    fontWeight: 'bold',
                                    position: 'absolute',
                                    top: '-28px', // 위치 조정 필요시 이 값 수정
                                    left: '0',
                                    zIndex: 10,
                                    fontSize: '14px',
                                    padding: '2px 4px',
                                    borderRadius: '4px'
                                }}>
                                    ※ 날짜를 확인하세요.
                                </Form.Text>

                            )}

                            <InputGroup>
                                <Form.Control type="date" onChange={handleSearchChange1} name='startDate' />
                                <InputGroup.Text>~</InputGroup.Text>
                                <Form.Control type="date" onChange={handleSearchChange1} name='endDate' />
                            </InputGroup>
                        </Col>
                    </Row>
                </Col>

                {/* 오른쪽: 발주자 + 검색 버튼 */}
                <Col md={3} className="d-flex justify-content-end align-items-center gap-2">
                    <Form.Control
                        placeholder="발주자 입력"
                        size='sm'
                        style={{ width: '150px' }}
                        onChange={handleOrderNameChange}
                        name='orderName'
                        value={orderName}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault(); // 폼 제출 방지
                                setPageNum(1);
                                fetchOrderList({ ...searchState, orderName }, 1);
                            }
                        }}
                    />
                    <Button
                        variant="success"
                        
                        onClick={() => {
                            setPageNum(1);
                            fetchOrderList({ ...searchState, orderName }, 1);
                        }}
                    >검색</Button>
                </Col>
            </Row>


            {/* 발주 주문 테이블 */}
            <Table bordered hover className="text-center">
                <thead className='table-secondary'>
                    <tr>
                        {/* 테이블열 */}
                        <th>지점명</th>
                        <th>발주번호</th>
                        <th>발주일자</th>
                        <th>발주자</th>
                        <th>총액</th>
                        <th>상태</th>
                        <th>상세보기</th>

                    </tr>
                </thead>
                <tbody>

                    {                    
                        orderList.list.map(item => (
                            <tr key={item.orderId}>
                                <td>{item.storeName}</td> {/* 지점명 */}
                                <td>{item.orderId}</td> {/* 발주번호 */}
                                <td>{item.ordDate}</td> {/* 발주일자 */}
                                <td>{item.orderName}</td> {/* 발주자 */}
                                <td>{item.totalPrice.toLocaleString()}</td> {/* 총액 */}
                                <td>
                                    <Button
                                        variant={
                                            item.cdStatus === 'PEN' ? 'warning'
                                                : item.cdStatus === 'APP' ? 'success'
                                                    : item.cdStatus === 'REJ' ? 'danger'
                                                        : 'secondary'
                                        }
                                        style={{
                                            fontSize: '15px',
                                            fontWeight: 'bold',
                                            backgroundColor:
                                                item.cdStatus === 'PEN' ? '#FFA500' :
                                                    item.cdStatus === 'APP' ? '#28a745' :
                                                        item.cdStatus === 'REJ' ? '#dc3545' :
                                                            '#6c757d',
                                            color: 'white'
                                        }}
                                        size="sm"
                                        disabled
                                    >
                                        {
                                            item.cdStatus === 'PEN' ? '대기' :
                                                item.cdStatus === 'APP' ? '승인' :
                                                    item.cdStatus === 'REJ' ? '반려' :
                                                        '미확인'
                                        }
                                    </Button>
                                </td>
                                <td>
                                    <Button
                                        as={Link}
                                        to={`/ceo/orders/${item.orderId}/detail`}
                                        variant="outline-dark"
                                        size="sm"
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            padding: '4px 12px',
                                            borderRadius: '6px',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        상세보기
                                    </Button>
                                </td>
                            </tr>
                        ))

                    }
                </tbody>
            </Table>

            <div className='d-flex justify-content-center mt-3'>
                <Pagination className='mt-3'>
                    {/* 이전버튼 */}
                    <Pagination.Item onClick={() => move(orderList.startPageNum - 1)} disabled={orderList.startPageNum === 1 || orderList.list.length === 0}>Prev</Pagination.Item>

                    {/* 숫자버튼 */}
                    {
                        pageArray.map(item =>
                            <Pagination.Item
                                key={item}
                                active={item === pageNum}
                                onClick={() => move(item)}
                            >
                                {item}
                            </Pagination.Item>

                        )
                    }

                    {/* 다음버튼 */}
                    <Pagination.Item onClick={() => move(orderList.endPageNum + 1)} disabled={orderList.endPageNum === orderList.totalPageCount}>Next</Pagination.Item>
                </Pagination>
            </div>

        </Container>
    );
}

export default CeoOrder;