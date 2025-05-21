import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import type { orderDetail, OrderDetailProps } from "../../types/OrderType";
import './InvOrdStyle.css';
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";


function OrdDetail({
    orderItem,
    clickCnt,
    orderId
}: OrderDetailProps) {

    const navigate = useNavigate();

    // 오늘 날짜 가져오는 함수
    const getToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    //로그인한 userId가져오기
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user.userId;
    const storeName = user.storeName;

    // 발주서 요청 정보
    const [orderDetail, setOrderDetail] = useState<orderDetail>({
        infoDto: {
            tmp: false,
            orderId: 0,
            userId: userId,                 
            totalPrice: 0,
            ordDate: getToday(),
            orderName: "",
            cdStatus: "",
            storeName: storeName,
            storeCall: "",
            memoRequest: "",
            memoReply: ""
        },
        itemList: []
    });

    // 활성화 될 때
    useEffect(() => {
        // 사용자 정보의 지점 전화번호 가져오기
        api.get("user/store-call/"+userId)
        .then(res => {
            console.log("데이터 가져옴",res.data);
            setOrderDetail({...orderDetail, infoDto:{...orderDetail.infoDto, storeCall: res.data}});
        })
        .catch(err=>console.log("오류 발생", err))

        // 이미 있는 발주서를 보는 경우
        if (orderId! > 0) {
            console.log("이미 있는 발주서를 보는 경우")
            // 해당 발주 번호로 정보 가져오기
            api.get("ord/detail/" + orderId)
                .then(res => {
                    const data = res.data.infoDto;
                    data.ordDate = data.ordDate.slice(0, 10);
                    console.log(res.data);
                    setOrderDetail({ infoDto: data, itemList: res.data.itemList });
                })
                .catch(err => console.log(err));
        }
        console.log("발주 상태: ", orderDetail.infoDto)
    }, []);

    // 임시 저장 버튼 핸들러
    const saveBtnHandle = () => {
        if (confirm("작성하신 내용을 임시저장 하시겠습니까?")) {
            const newOrderDetail = {
                ...orderDetail,
                infoDto: {
                    ...orderDetail.infoDto,
                    tmp: true,
                    cdStatus: 'WAIT'
                }
            };

            // 이미 있던 발주서를 임시 저장 하는 경우
            if (orderDetail.infoDto.cdStatus === 'WAIT'
            ) {
                api.patch("/ord/edit", newOrderDetail)
                    .then(() => {
                        alert("임시저장 성공");
                        // 발주 현황 목록 화면으로 돌아가기
                        navigate("/admin/order-list");
                    })
                    .catch(err => {
                        console.log(err);
                        alert("임시저장 실패");
                    });
                // 새 발주서를 임시 저장 하는 경우
            } else {
                api.post("/ord/add", newOrderDetail)
                    .then(() => {
                        alert("임시저장 성공");
                        // 발주 현황 목록 화면으로 돌아가기
                        navigate("/admin/order-list");
                    })
                    .catch(err => {
                        console.log(err);
                        alert("임시저장 실패");
                    });
            }

        }
    }

    // 새로 작성 버튼 핸들러
    const resetBtnHandle = () => {
        if (confirm("정말로 작성된 내용을 모두 지우시겠습니까?"))
            setOrderDetail({
                infoDto: {
                    ...orderDetail.infoDto,
                    tmp: false,
                    orderId: 0,
                    totalPrice: 0,
                    ordDate: getToday(),
                    orderName: "",
                    cdStatus: "",
                    memoRequest: "",
                    memoReply: ""
                },
                itemList: []
            });
    }

    // 발주 요청 버튼 핸들러
    const requestBtnHandle = () => {
        // 빈칸 확인
        if (orderDetail.infoDto.orderName === '') {
            alert("❗발주자 이름을 입력하세요.");
        } else if (orderDetail.itemList.length < 1) {
            alert("❗발주 품목을 추가하세요.");
        } else {

            const hasInvalidItem = orderDetail.itemList.some((item, index) => {
                if (item.quantity < 1 || item.quantity === undefined) {
                    alert(`❗주문 품목의 올바른 수량을 입력해주세요. \n- 품목: ${item.productName} (NO:${index + 1})`);
                    return true;
                }
                return false;
            });

            if (hasInvalidItem) return;
            // 유효성 확인 모두 통과

            let answer = false;
            // 이미 있는 발주서를 재요청하는 경우
            if (orderId! > 0) answer = confirm(getToday() + "일자로 해당 발주서가 재요청됩니다.");
            // 새 발주서를 요청하는 경우
            else answer = confirm("발주 요청하시겠습니까? \n발주 요청 이후에는 취소할 수 없습니다.");

            if (answer) {
                // 재발주 경우
                if (orderId! > 0) {
                    setOrderDetail({
                        ...orderDetail,
                        infoDto: {
                            ...orderDetail.infoDto,
                            ordDate: getToday()
                        }
                    });
                    api.patch("/ord/edit-order", orderDetail)
                        .then(() => {
                            alert("발주 요청 성공");
                            navigate("/admin/order-list")
                        })
                        .catch(err => {
                            console.log(err);
                            alert("발주 요청 실패");
                        });
                    // 새발주 경우
                } else {
                    api.post("/ord/add", orderDetail)
                        .then(() => {
                            alert("발주 요청 성공");
                            // 발주 현황 목록 화면으로 돌아가기
                            navigate("/admin/order-list")
                        })
                        .catch(err => {
                            console.log(err);
                            alert("발주 요청 실패");
                        });
                }
            }
        }
    };

    // 품목의 수량 입력 핸들러
    const handleQuantityChange = (index: number, value: number) => {
        const updated = [...orderDetail.itemList];
        // console.log(updated);
        console.log("index 번호:", index, value)
        // 해당 품목의 수량 반영
        updated[index].quantity = value;
        // 수량과 금액 곱한 값 반영
        updated[index].calPrice = updated[index].price * value;
        setOrderDetail({
            itemList: updated,
            infoDto: {
                ...orderDetail.infoDto,
                totalPrice: updated.reduce((sum, item) => sum + item.quantity * item.price, 0)
            }
        });
    };

    // 품목 삭제 핸들러
    const handleDelete = (index: number) => {
        const updated = orderDetail.itemList.filter((_, i) => i !== index);
        setOrderDetail({ ...orderDetail, itemList: updated });
    };

    // 품목 현황에서 추가버튼이 눌릴 때
    useEffect(() => {
        // console.log("발주서 상태:" + orderDetail.infoDto.cdStatus)
        // 최초 클릭 경우 배열 초기화 후 품목 추가
        if (clickCnt === 1 && orderDetail.infoDto.cdStatus === '') {
            console.log("최초 추가 버튼", clickCnt, orderItem)
            setOrderDetail({ ...orderDetail, itemList: [orderItem] });
            // 그 외의 경우 기존 배열에 품목 추가
        } else if ((clickCnt > 1)
            || (clickCnt === 1 && orderDetail.infoDto.cdStatus === 'PEN')
        ) {
            console.log("이후 추가 버튼", clickCnt, orderItem)
            setOrderDetail({ ...orderDetail, itemList: [...orderDetail.itemList, orderItem] });
        }
    }, [orderItem]);

    return (
        <>
            <Container fluid className="">
                <Row className="my-4">
                    <Col>
                        <h2 className="mb-4 fw-bold text-center">발주서</h2>
                        <Row className="mb-3">
                            <Col>
                                <Form.Label>발주번호</Form.Label>
                                <Form.Control readOnly
                                    value={orderDetail.infoDto.orderId > 0 ? orderDetail.infoDto.orderId : "(미정)"} />
                            </Col>
                            <Col>
                                <Form.Label>발주일자</Form.Label>
                                <Form.Control type="date" readOnly
                                    value={orderDetail.infoDto.ordDate ?? getToday()} />
                            </Col>
                            <Col>
                                <Form.Label>총 금액</Form.Label>
                                <Form.Control readOnly
                                    value={orderDetail.infoDto.totalPrice ?? 0} />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Label>발주 지점</Form.Label>
                                <Form.Control readOnly
                                    value={orderDetail.infoDto.storeName} />
                            </Col>
                            <Col>
                                <Form.Label>연락처</Form.Label>
                                <Form.Control readOnly
                                    value={orderDetail.infoDto.storeCall} />
                            </Col>
                            <Col>
                                <Form.Label>발주자<span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control required
                                    readOnly={orderDetail.infoDto.cdStatus === 'APP' || orderDetail.infoDto.cdStatus === 'APR'}
                                    value={orderDetail.infoDto.orderName}
                                    onChange={(e) => setOrderDetail({
                                        ...orderDetail,
                                        infoDto: {
                                            ...orderDetail.infoDto,
                                            orderName: e.target.value
                                        }
                                    }
                                    )} />
                            </Col>
                        </Row>

                        <Table bordered className="text-center" >
                            <thead>
                                <tr>
                                    <th className='col-1'>NO</th>
                                    <th className='col-2'>품목 코드</th>
                                    <th className='col-2'>품목명</th>
                                    <th className='col-2'>단가</th>
                                    <th className='col-2'>수량<span style={{ color: 'red' }}>*</span></th>
                                    <th className='col-2'>금액</th>
                                    <th className='col-1'>삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetail.itemList.length < 1 ?
                                    <tr key={uuid()}>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    :
                                    orderDetail.itemList.map((item, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{item.productId}</td>
                                            <td>{item.productName}</td>
                                            <td>{item.price}</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={item.quantity ?? 0}
                                                    readOnly={orderDetail.infoDto.cdStatus === 'APP' || orderDetail.infoDto.cdStatus === 'APR'}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        if (!isNaN(val)) handleQuantityChange(i, val);
                                                    }}
                                                />
                                            </td>
                                            <td>{isNaN(item.price * item.quantity) ? 0 : item.price * item.quantity}</td>
                                            <td>
                                                <a style={{ cursor: 'pointer', color: 'red' }}
                                                    onClick={() => { if (!(orderDetail.infoDto.cdStatus === 'APP' || orderDetail.infoDto.cdStatus === 'APR')) handleDelete(i) }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                    </svg>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}



                            </tbody>
                        </Table>

                        <Form.Group className="mb-3">
                            <Form.Label>발주 메모 to 본사</Form.Label>
                            <Form.Control as="textarea" value={orderDetail.infoDto.memoRequest}
                                onChange={(e) => setOrderDetail({
                                    ...orderDetail,
                                    infoDto: {
                                        ...orderDetail.infoDto,
                                        memoRequest: e.target.value
                                    }
                                })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>발주 메모 to 지점</Form.Label>
                            <Form.Control readOnly as="textarea" value={orderDetail.infoDto.memoReply} />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary"
                                disabled={orderDetail.infoDto.cdStatus === 'APP' || orderDetail.infoDto.cdStatus === 'PEN'}
                                onClick={resetBtnHandle}>새로 작성</Button>
                            <Button variant="secondary"
                                disabled={orderDetail.infoDto.cdStatus === 'APP' || orderDetail.infoDto.cdStatus === 'PEN'}
                                onClick={saveBtnHandle}>임시저장</Button>
                            <Button style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }}
                                disabled={orderDetail.infoDto.cdStatus === 'APP' || orderDetail.infoDto.cdStatus === 'PEN'}
                                onClick={requestBtnHandle}>발주 요청</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default OrdDetail;