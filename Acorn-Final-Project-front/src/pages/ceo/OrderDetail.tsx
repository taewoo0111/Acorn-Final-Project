import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../../api';
import { v4 as uuid } from "uuid";
import ConfirmModal from '../../components_HUI/ConfirmModal';

function OrderDetail() {
    // 상세보기 주소로 넘어온 orderId 에 해당되는 경로 파라미터 값 읽어오기
    const { orderId } = useParams();

    // 검색한 상품 이름
    const [searchParams, setSearchParams] = useSearchParams();
    const productName = searchParams.get("productName");

    // 검색어 상태 추가
    const [searchText, setSearchText] = useState("");

    // 검색 버튼 클릭 시 실행할 함수
    const handleSearch = () => {
        // 검색어가 있는 경우 검색 파라미터 추가    
        if (searchText.trim()) {
            setSearchParams({ productName: searchText });
        } else {
            // 검색어가 없는 경우 검색 파라미터 제거
            setSearchParams({});
        }
    }




    // 발주 품목 상세정보 기본정보 상태값으로 관리
    const [orderInfo, setOrderInfo] = useState({
        ordDate: "",
        orderName: "",
        storeCall: "",
        totalPrice: "",
        cdStatus: "",
        memoReply: "",
        memoRequest: ""
    })

    // 발주 품목 상세정보 기본 정보 가져오는 함수 설정
    const getInfo = () => {
        api.get(`/orders/info/${orderId}`)
            .then(res => {
                setOrderInfo(res.data);
                console.log(res.data);
                if (!writeReply) {
                    // null 또는 undefined 시 빈 문자열로 처리
                    setWriteReply(res.data.memoReply ?? "");
                }

            })
            .catch(error => {
                console.log(error);
            })
    }

    // 해당 발주서 품목 테이블 정보 상태값
    const [orderProduct, setOrderProduct] = useState({
        list: []

    });

    // 해당 발주서 품목 가지고 오기
    const getProduct = () => {
        api.get("/orders/product", {
            params: {
                orderId,
                productName: searchText
            }
        })
            .then(res => {
                // console.log(res.data);
                setOrderProduct(res.data);


            })
            .catch(error => {
                console.log(error);
            });
    }

    // 승인 반려 모달창 여부
    const [appModalShow, setAppModalShow] = useState(false);
    const [rejectModalShow, setRejectModalShow] = useState(false);


    // 승인 완료 시 이동할 훅
    const navigate = useNavigate();

    // 작성한 본사 메모 내용 상태값으로 관리
    const [writeReply, setWriteReply] = useState("");

    // 저장 버튼 클릭시 메모 저장
    const saveMemo = () => {
        api.patch("/orders/memoreply", {
            orderId,
            memoReply: writeReply
        })
            .then((res => {
                console.log("확인", res.data);
                alert("메모 저장 성공!")
                getInfo();
            }))
            .catch(error => {
                console.log(error);
            })
    }





    useEffect(() => {
        // 기본 정보로 가지고 오기(본사, 지점 메모 포함)
        getInfo();
        // orderId 애 해당하는 품목 가지고 오기
        getProduct();
        // null 혹은 undefined 인 경우 빈 문자열 저장
        setWriteReply(orderInfo.memoReply ?? "")



    }, [orderId, productName]);



    return (
        <>
            {/* 승인 모달창 */}
            <ConfirmModal
                show={appModalShow}
                message="선택하신 주문을 승인하시겠습니까?"
                onCancel={() => setAppModalShow(false)}
                onYes={() => {
                    api.patch("/orders/app", {
                        orderId
                    })
                        .then(res => {
                            console.log("승인 성공", res.data);
                            setAppModalShow(false);
                            alert("승인을 성공했습니다.")
                            navigate("/ceo/orders");
                        })
                        .catch(error => {
                            console.log(error);
                            alert("승인을 실패했습니다.");
                        });
                    setAppModalShow(false);
                }}
            >
            </ConfirmModal>

            {/* 반려 모달창 */}
            <ConfirmModal
                show={rejectModalShow}
                message="선택하신 주문을 반려하시겠습니까?"
                onCancel={() => setRejectModalShow(false)}
                onYes={() => {

                    api.patch("/orders/rej", {
                        orderId
                    })
                        .then(res => {
                            alert("반려를 성공했습니다.")
                            console.log("반려 성공", res.data);
                            navigate("/ceo/orders");
                        })
                        .catch(error => {
                            alert("반려를 실패했습니다.")
                            console.log(error);
                        });
                    setRejectModalShow(false);
                }}
            >
                {
                    !writeReply.trim() &&
                    <div style={{ color: 'red', fontWeight: 'bold', marginTop: '10px', fontSize: '14px' }}>
                        ※ 본사요청 메모가 비어있습니다.
                    </div>
                }
            </ConfirmModal>


            <Container>
                <h1 className='my-3'>발주 상세 페이지</h1>
                <Row>
                    {/* 죄측 : 지점 요청, 본사 피드백 */}
                    <Col md={3}>
                        {/* 지점 */}
                        <Card className='mb-2 h-50' >
                            <Card.Header>지점요청</Card.Header>
                            <Card.Body>
                                <Form.Control
                                    as="textarea"
                                    rows={6}
                                    value={orderInfo.memoRequest ?? ""}
                                    style={{ height: '250px' }}
                                    className='p-2'
                                    disabled
                                />
                            </Card.Body>
                        </Card>

                        {/* 본사 */}
                        <Card className='h-50'>
                            <Card.Header>본사 피드백</Card.Header>
                            <Card.Body>
                                <Form.Control
                                    as="textarea"
                                    rows={6}
                                    value={writeReply} // 기존 본사 피드백이 있었다면 가지고 오기
                                    onChange={(e) => setWriteReply(e.target.value)}
                                    style={{ height: '230px' }}
                                    className='p-2'
                                    disabled={orderInfo.cdStatus === 'APP'} // 승인 상태면 비활성화
                                />
                                {
                                    // 승인 상태면 메모 수정 못함
                                    orderInfo.cdStatus !== 'APP' &&
                                    <Button variant='success' className='mt-2 float-end' onClick={saveMemo}>저장</Button>
                                }

                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 주문 상세 정보*/}
                    <Col md={9}>
                        <Card>
                            <Card.Header>주문상세</Card.Header>
                            <Card.Body>
                                <Form>
                                    {/* 주문번호, 발주자, 총금액 */}
                                    <Row className="mb-3">
                                        <Col md={3}>
                                            <Form.Group controlId="orderId">
                                                <Form.Label >주문번호</Form.Label>
                                                <Form.Control value={orderId} readOnly />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group controlId="orderer">
                                                <Form.Label>발주자</Form.Label>
                                                <Form.Control value={orderInfo.orderName} readOnly />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group controlId="totalAmount">
                                                <Form.Label className="fw-bold">총금액</Form.Label>
                                                <Form.Control className="fw-bold" value={orderInfo.totalPrice.toLocaleString()} readOnly />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* 주문등록일, 연락처 */}
                                    <Row className="mb-3">
                                        <Col md={3}>
                                            <Form.Group controlId="regDate">
                                                <Form.Label>주문등록일</Form.Label>
                                                <Form.Control value={orderInfo.ordDate} readOnly />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group controlId="phone">
                                                <Form.Label>연락처</Form.Label>
                                                <Form.Control value={orderInfo.storeCall} readOnly />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                        {/* 주문 상태 및 검색조건 , 승인 & 반려 */}
                        <Row className="align-items-center my-2">
                            {/* 상태 */}
                            <Col md={3} className="d-flex align-items-center">
                                <span className="me-2 fw-bold">현재 주문 상태 :</span>
                                <Button
                                    variant={
                                        orderInfo.cdStatus === 'PEN' ? 'warning'
                                        : orderInfo.cdStatus === 'APP' ? 'success'
                                        : orderInfo.cdStatus === 'REJ' ? 'danger'
                                        : 'secondary' // 예외 처리 
                                    }
                                    style={{
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                        backgroundColor:
                                        orderInfo.cdStatus === 'PEN' ? '#FFA500' :    // 진한 주황 (PEN)
                                        orderInfo.cdStatus === 'APP' ? '#28a745' :    // 진한 초록 (APP)
                                        orderInfo.cdStatus === 'REJ' ? '#dc3545' :    // 진한 빨강 (REJ)
                                        '#6c757d',                                    // 예외: 회색
                                         color: 'white'
                                    }}
                                    size="sm"
                                    disabled

                                >{
                                            orderInfo.cdStatus === 'PEN' ? '대기' :
                                                orderInfo.cdStatus === 'APP' ? '승인' :
                                                    orderInfo.cdStatus === 'REJ' ? '반려' :
                                                        '미확인'
                                        }</Button>
                            </Col>
                            {/* 검색 */}
                            <Col md={5}>
                                <InputGroup>
                                    <Form.Control
                                        placeholder="상품명 입력..."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleSearch();
                                            }
                                        }}
                                    />
                                    <Button variant="dark" onClick={handleSearch}>검색</Button>
                                </InputGroup>
                            </Col>
                            {/* 버튼 */}
                            {
                                orderInfo.cdStatus !== 'APP' &&
                                // 승인 상태가 아닐 때만 승인/ 반려 가능
                                <Col md={4} className="text-end">
                                    <Button variant="primary" className="me-2" onClick={() => setAppModalShow(true)}>승인</Button>
                                    <Button variant="danger" onClick={() => setRejectModalShow(true)}>반려</Button>
                                </Col>
                            }
                        </Row>

                        {/* 테이블 */}
                        <Card>
                            <Card.Header>발주 품목 테이블</Card.Header>
                            <Card.Body>
                                <Row>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        <Table className="text-center">
                                            <thead>
                                                <tr>
                                                    <th>상품번호</th>
                                                    <th>상품명</th>
                                                    <th>단가</th>
                                                    <th>수량</th>
                                                    <th>청구비용</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    orderProduct.list.map(item => (
                                                        <tr key={uuid()}>
                                                            <td>{item.productId}</td>
                                                            <td>{item.productName}</td>
                                                            <td>{item.price.toLocaleString()}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.cost.toLocaleString()}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default OrderDetail;