import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import api from "../../api";
import { InventoryItemDetail, InvModalProps } from "../../types/InventoryType";

function InvModal({
    invModal,
    setInvModal,
    refreshDetail,
    refreshList,
    pname }: InvModalProps) {
    // 오늘 날짜 가져오는 함수
    const getToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 모달창 정보 상태값
    const [invModalDetail, setInvModalDetail] = useState<InventoryItemDetail>({
        productId: 0,
        productName: '',
        invId: invModal.invId,
        invDate: getToday(),
        invPlus: 0,
        invMinus: 0,
        div: 0,
        qty: 0,
        userId: 5   // 유저 아이디 넣을 필요가 있음!!
    });

    // 모달을 띄울 세부내역의 아이디가 바뀌면 상태값에 반영 (단, 0번 제외)
    useEffect(() => {
        console.log("모달로 보여줄 아이디: " + invModal.invId)
        if (invModal.invId !== 0) {
            setInvModalDetail({
                ...invModalDetail,
                invId: invModal.invId
            });
            getInventoryDetail();
        }
    }, [invModal.invId]);

    // 모달을 띄울 품목이름이 바뀌면 상태값에 반영 (단, 0번 제외)
    useEffect(() => {
        //페이지 로딩 시 선택값 없으니 제외
        if(!pname)return;
        // 품목 번호 가져와 셋팅
        api.get("/inv/getPid/" + pname)
            .then(res => {
                setInvModalDetail({
                    ...invModalDetail,
                    productId: res.data,
                    productName: pname,
                    invDate: getToday()
                });
            })
            .catch(err => {
                console.log(err);
            });
    }, [pname]);



    // 수정할 정보 가져오는 함수
    const getInventoryDetail = () => {
        console.log("수정할 정보 가져오기 함수", invModal.invId)
        api.get("/inv/detail/" + invModal.invId)
            .then(res => {
                console.log(res.data);
                setInvModalDetail({
                    ...invModalDetail,
                    productId: res.data.productId,
                    productName: res.data.productName,
                    invId: res.data.invId,
                    invDate: res.data.invDate.split(' ')[0],
                    invPlus: res.data.invPlus,
                    invMinus: res.data.invMinus,
                    div: res.data.div,
                    qty: res.data.div > 0 ? res.data.invPlus : res.data.invMinus
                });
            })
            .catch(err => console.log(err));
    };

    // 값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        console.log("값을 변경한 속성의 이름은 " + targetName);
        console.log("값을 변경한 속성의 값은 " + targetValue);

        // 구분 변경 시
        if (targetName === "div") {
            if (Number(targetValue) > 0) {
                // 입고량 경우
                setInvModalDetail({
                    ...invModalDetail,
                    invPlus: invModalDetail.qty,
                    [targetName]: Number(targetValue)
                });

            } else {
                // 사용량 경우
                setInvModalDetail({
                    ...invModalDetail,
                    invMinus: invModalDetail.qty,
                    [targetName]: Number(targetValue)
                });
            }
        }

        // 품목 코드 변경 시
        else if (targetName === "productId") {
            console.log("품목 코드 변경 시")
            api.get("/inv/getPname/" + targetValue)
                .then(res => {
                    setInvModalDetail({
                        ...invModalDetail,
                        [targetName]: Number(targetValue),
                        productName: res.data
                    });
                })
                .catch(err => {
                    console.log(err);
                    setInvModalDetail({
                        ...invModalDetail,
                        [targetName]: Number(targetValue),
                        productName: ''
                    });
                });
        }
        // 품목 이름 변경 시
        else if (targetName === "productName") {
            console.log("품목 이름 변경 시");
            api.get("/inv/getPid/" + targetValue)
                .then(res => {
                    setInvModalDetail({
                        ...invModalDetail,
                        [targetName]: targetValue,
                        productId: res.data ?? 0
                    });
                })
                .catch(err => {
                    console.log(err);
                    setInvModalDetail({
                        ...invModalDetail,
                        [targetName]: targetValue,
                        productId: 0
                    });
                });
        }
        // 수량 변경 시
        else if (targetName === "qty") {
            if (invModalDetail.div > 0) {
                // 입고 경우
                console.log("입고 경우")
                setInvModalDetail({
                    ...invModalDetail,
                    invPlus: Number(targetValue),
                    [targetName]: Number(targetValue)
                });
            } else {
                // 사용 경우
                console.log("사용 경우")
                setInvModalDetail({
                    ...invModalDetail,
                    invMinus: Number(targetValue),
                    [targetName]: Number(targetValue)
                });
            }
        }
        else {
            setInvModalDetail({
                ...invModalDetail,
                [targetName]: targetValue
            });
        }
    };

    // 저장 버튼 핸들러
    const handleSubmit = () => {
        // 저장 전 빈 칸 확인
        if(invModalDetail.productId<1){
            alert("❗품목 번호를 입력하세요.")
        } else if(invModalDetail.productName===''){
            alert("❗품목명을 입력하세요.")   
        } else if(invModalDetail.qty<1){
            alert("❗올바른 수량을 입력하세요")   
        } else {
            // 수정의 경우
            if(invModalDetail.invId>0){
                console.log("-----------수정 저장");
                api.patch("/inv/edit/"+invModalDetail.invId, invModalDetail)
                .then(res => {
                    console.log(res);
                    // 모달 창 닫기
                    handleClose();
                    refreshDetail();
                    refreshList();
                    alert("저장 성공");
    
                })
                .catch(err => {
                    console.log(err);
                    alert("저장 실패");
                });
            // 새 추가의 경우
            } else {
                console.log("------------추가 저장");
                api.post("/inv/add", invModalDetail)
                .then(res => {
                    console.log(res);
                    // 모달 창 닫기
                    handleClose();
                    refreshDetail();
                    refreshList();
                    alert("저장 성공");
    
                })
                .catch(err => {
                    console.log(err);
                    alert("저장 실패");
                });
            }


            console.log("저장 버튼 클릭");
            
        }
    };


    // 모달 창 닫기 함수
    const handleClose = () => setInvModal({ ...invModal, isShow: false });


    // <pre>{JSON.stringify(invModalDetail,null,4)}</pre>
    return (
        <>
            <Modal show={invModal.isShow} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>{invModal.invId > 0 ? '수정하기' : '추가하기'}</Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>품목 번호</Form.Label>
                            <Form.Control
                                type="text"
                                name="productId"
                                value={invModalDetail.productId}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>품목명</Form.Label>
                            <Form.Control
                                type="text"
                                name="productName"
                                value={invModalDetail.productName}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>구분</Form.Label>
                            <Form.Select name="div"
                                value={invModalDetail.div > 0 ? '1' : '0'}
                                onChange={handleChange}>
                                <option value="1">입고</option>
                                <option value="0">사용</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>날짜</Form.Label>
                            <Form.Control
                                type="date"
                                name="invDate"

                                value={invModalDetail.invDate}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>수량</Form.Label>
                            <Form.Control
                                type="number"
                                name="qty"
                                value={invModalDetail.qty}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSubmit} style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }}>
                        저장
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default InvModal;