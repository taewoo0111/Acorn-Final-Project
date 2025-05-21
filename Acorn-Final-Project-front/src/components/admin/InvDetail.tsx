import { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import InvModal from './InvModal';
import type { InvDetailProps, InventoryItemDetail, InvtoryModal } from '../../types/InventoryType';
import api from '../../api';
import './InvOrdStyle.css';
import { v4 as uuid } from "uuid";

function InvDetail({
    refreshDetail,
    strDate,
    endDate,
    setStrDate,
    setEndDate,
    itemDetail,
    refreshList
}: InvDetailProps) {

    // 선택 품목명
    const [pname, setPname] = useState<string>('');

    //모달창 띄우기 관련 상태값
    const [invModal, setInvModal] = useState<InvtoryModal>(
        {
            isShow: false,
            invId: 0,
            proId: 0
        }
    );

    // 조회 버튼 핸들러 
    const handleSearch = () => {
        console.log('검색 날짜:', strDate, endDate);
        refreshDetail();
    };

    // 추가 버튼 핸들러 
    const handleAdd = () => {
        const productId = itemDetail[0]?.productId ?? null;
        console.log('추가 버튼 클릭');
        // 모달 띄우기
        setInvModal({
            ...invModal,
            invId: 0,
            isShow: true,
            proId: productId
        })
    };

    // 수정 버튼 핸들러
    const handleEdit = (editId: number) => {
        // 추가 모달
        console.log('수정할 invId:', editId);
        // 모달 띄우기
        setInvModal({
            isShow: true,
            invId: editId,
            proId: itemDetail[0].productId,
        });
    };

    // 삭제 버튼 핸들러
    const handleDelete = (delId: number) => {
        const answer: boolean = confirm("정말 삭제하시겠습니까?");
        console.log('삭제?:', delId, answer);
        if (!answer) return;

        api.delete("/inv/delete/" + delId)
            .then(res => {
                console.log(res);
                alert("삭제 성공");
                refreshDetail();
            })
            .catch(err => {
                console.log(err);
                alert("삭제 실패");
            });
    };



    // 컴포넌트 활성화 시
    useEffect(() => {
        // 오늘 날짜 기준으로 한 달 범위 잡기
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const last = new Date(year, month, 0);
        const lastdate = last.getDate();

        // 조회 시작 날짜로 셋팅
        setStrDate(`${year}-${String(month).padStart(2, '0')}-01`);
        // 조회 끝 날짜로 셋팅
        setEndDate(`${year}-${String(month).padStart(2, '0')}-${String(lastdate).padStart(2, '0')}`);
    }, []);

    // 선택된 품목이 바뀔 경우
    useEffect(() => {
        if (itemDetail && itemDetail.length > 0 && itemDetail[0].productId) {
            api.get("/inv/getPname/" + itemDetail[0].productId)
                .then(res => {
                    setPname(res.data);
                })
                .catch(err => console.log(err));
        }
    }, [itemDetail]);

    //<pre>{JSON.stringify(invModal,null,4)}</pre>
    return (
        <><div className='div-inv-detail'>

            <div className="p-4">
                <h3 className="mb-4 fw-bold text-center">입고 및 사용 내역 : {pname}</h3>
                <Row className="mb-3">
                    <Col sm="auto" className="d-flex align-items-center fw-semibold">
                        날짜
                    </Col>
                    <Col sm>
                        <Form.Control
                            type="date"
                            value={strDate}
                            onChange={(e) => setStrDate(e.target.value)}
                        />
                    </Col>
                    ~
                    <Col sm>
                        <Form.Control
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Col>
                    <Col sm="auto">
                        <Button variant="secondary" onClick={handleSearch}>
                            조회
                        </Button>
                    </Col>
                    <Col sm="auto">
                        <Button style={{ backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }} onClick={handleAdd}>
                            추가
                        </Button>
                    </Col>
                </Row>

                <div className="table-wrapper">
                    <Table bordered size="sm" className="bg-white">
                        <thead className="text-center">
                            <tr className='text-center'>
                                <th>날짜</th>
                                <th>입고</th>
                                <th>사용</th>
                                <th>수정</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {itemDetail.map((item: InventoryItemDetail) => (
                                <tr key={uuid()}>
                                    <td>{item.invDate.split(' ')[0]}</td>
                                    <td>{item.invPlus! > 0 ? item.invPlus : '-'}</td>
                                    <td>{item.invMinus! > 0 ? item.invMinus : '-'}</td>
                                    <td>
                                        <a style={{ cursor: 'pointer', color: 'light' }}
                                            onClick={() => handleEdit(item.invId)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-journal-text" viewBox="0 0 16 16">
                                                <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                                                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
                                                <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
                                            </svg>
                                        </a>
                                    </td>
                                    <td>
                                        <a style={{ cursor: 'pointer', color: 'red' }}
                                            onClick={() => handleDelete(item.invId)}>
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
                </div>
            </div>
            <InvModal
                invModal={invModal}
                setInvModal={setInvModal}
                refreshDetail={refreshDetail}
                refreshList={refreshList}
                pname={pname}
            ></InvModal>
        </div></>

    );
}

export default InvDetail;