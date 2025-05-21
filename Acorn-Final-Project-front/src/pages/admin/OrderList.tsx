import { useEffect, useState } from "react";
import { Button, Container, Form, Pagination, Table } from "react-bootstrap";
import api from "../../api";
import type { FilterCondition, PageInfo } from "../../types/OrderType";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import '../../components/admin/InvOrdStyle.css';
import { v4 as uuid } from "uuid";


function OrderList() {
    // 오늘 날짜 기준으로 한 달 범위 함수
    const getDateRange = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const last = new Date(year, month, 0);
        const lastdate = last.getDate();
        return [`${year}-${String(month).padStart(2, '0')}-01`,
        `${year}-${String(month).padStart(2, '0')}-${String(lastdate).padStart(2, '0')}`]
    }

    // 주소창 셋팅
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // 페이징 숫자 출력용 배열
    const [pageArr, setPageArr] = useState<Array<number>>([]);

    // 페이지 요청 결과 정보
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        status: '',
        strDate: '',
        endDate: '',
        startPageNum: 0,
        endPageNum: 0,
        totalPageCount: 0,
        pageNum: 0,
        totalRow: 0,
        startRowNum: 0,
        endRowNum: 0,
        list: []
    });

    // 조회 조건
    const [filterCon, setFilterCon] = useState<FilterCondition>({
        strDate: getDateRange()[0],
        endDate: getDateRange()[1],
        status: 'ALL',
        pnum: 1
    });

    // 주소창 변화시 데이터 새로 로딩
    useEffect(() => {
        console.log("컴포넌트 활성화");
        // 주소창에서 page 에 해당하는 값 찾아 사용하기
        refreshList(Number(searchParams.get("page") || 1));
    }, [searchParams]);

    // 발주서 목록 가져오기
    const refreshList = (pnum: number) => {
        // 주소창에서 검색 조건 추출
        const status = searchParams.get("status") || "ALL";
        const strDate = searchParams.get("strDate") || getDateRange()[0];
        const endDate = searchParams.get("endDate") || getDateRange()[1];

        console.log(`/ord/${pnum}?status=${status}&strDate=${strDate}&endDate=${endDate}`);
        api.get(`/ord/${pnum}?status=${status}&strDate=${strDate}&endDate=${endDate}`)
            .then(res => {
                // 요청 결과 저장
                setPageInfo(res.data);

                // 하단 페이징 UI 개수 생성
                const result = [];
                for (let i = res.data.startPageNum; i <= res.data.endPageNum; i++) {
                    result.push(i);
                }
                setPageArr(result);
                setFilterCon({ status, strDate, endDate, pnum });
            }).catch(err => console.log(err));
    };

    // 삭제 버튼 핸들러
    const delBtnHandle = (status: string, pid: number) => {
        // 승인(APP) 또는 거절(REJ) 상태면 삭제 불가
        if (status === 'APP' || status === 'PEN') {
            alert('❗해당 상태에서는 삭제할 수 없습니다. \n( \'임시 저장\' 또는 \'거절\' 상태만 가능 )');
            return;
        }
        if (confirm("정말 삭제하시겠습니까?")) {
            api.delete("/ord/del/" + pid)
                .then(res => {
                    console.log(res);
                    alert('삭제되었습니다.');
                    refreshList(pageInfo.pageNum); // 삭제 후 리스트 갱신
                })
                .catch(err => console.log(err));
        }
    }



    // <pre>{JSON.stringify(filterCon,null,4)}</pre>

    return (
        <>
            
            <div className="flex" >
                <div style={{ flex: 1, margin: '0 8rem' }} >
                <style>
                {`
                    .pagination .page-link {
                    color:rgb(100, 131, 223);
                    }

                    .pagination .page-item.active .page-link {
                    background-color: rgb(71, 95, 168);
                    color: white;
                    }
                `}
                </style>                    
                    <Container fluid className="p-4">
                        <h2 style={{ marginTop: '60px', marginBottom: '60px' }} className="mb-4 text-center fw-bold">발주 현황</h2>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <NavLink to="/admin/order"><Button  style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }}>발주서 작성</Button></NavLink>
                            <div className="d-flex gap-2 align-items-center">
                                <Form.Label className="mb-0">날짜</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filterCon.strDate}
                                    onChange={(e) =>
                                        setFilterCon({
                                            ...filterCon,
                                            strDate: e.target.value
                                        })}
                                    style={{ width: "150px" }}
                                />
                                <Form.Control
                                    type="date"
                                    value={filterCon.endDate}
                                    onChange={(e) =>
                                        setFilterCon({
                                            ...filterCon,
                                            endDate: e.target.value
                                        })}
                                    style={{ width: "150px" }}
                                />
                                <Form.Label className="mb-0">상태</Form.Label>
                                <Form.Select
                                    value={filterCon.status}
                                    onChange={(e) =>
                                        // 상태값 변경
                                        setFilterCon({
                                            ...filterCon,
                                            status: e.target.value
                                        })}
                                    style={{ width: "120px" }}>
                                    <option value="ALL">모두</option>
                                    <option value="PEN">발주중</option>
                                    <option value="APP">승인</option>
                                    <option value="REJ">거절</option>
                                </Form.Select>
                                <Button style={{ backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }}
                                 onClick={() => {
                                    const num = 1;
                                    setFilterCon({...filterCon, pnum: num});
                                    navigate(`/admin/order-list?page=${num}&status=${filterCon.status}&strDate=${filterCon.strDate}&endDate=${filterCon.endDate}`);

                                }}>검색</Button>
                            </div>
                        </div>

                        <Table bordered className="text-center" hover>
                            <thead className="table-secondary">
                                <tr>
                                    <th style={{ width: '10%' }}>발주 번호</th>
                                    <th style={{ width: '20%' }}>발주 일자</th>
                                    <th style={{ width: '15%' }}>발주자</th>
                                    <th style={{ width: '15%' }}>발주 금액</th>
                                    <th style={{ width: '15%' }}>상태</th>
                                    <th style={{ width: '10%' }}>상세보기</th>
                                    <th style={{ width: '10%' }}>삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 10 }).map((_, i) => {
                                    const invoice = pageInfo.list[i];
                                    return (
                                        <tr key={uuid()} className="fixed-row">
                                            <td>{invoice?.orderId}</td>
                                            <td>{invoice?.ordDate}</td>
                                            <td>{invoice?.orderName}</td>
                                            <td>{invoice?.totalPrice}</td>
                                            <td>{invoice?.cdStatus === 'PEN' ? <Button style={{backgroundColor: '#FFA500', borderColor: '#FFA500' , color: 'white'}} disabled>발주중</Button> :
                                                invoice?.cdStatus === 'APP' ? <Button style={{backgroundColor: '#28a745', borderColor: '#28a745' , color: 'white' }} disabled>승인</Button> :
                                                    invoice?.cdStatus === 'REJ' ? <Button style={{backgroundColor: '#dc3545', borderColor: '#dc3545' , color: 'white' }} disabled>거절</Button> :
                                                        invoice?.cdStatus === 'WAIT' ? <Button  style={{backgroundColor: '#6c757d', borderColor: '#6c757d' , color: 'white' }} disabled>임시저장</Button> : ''}</td>
                                            <td>
                                                {invoice ? <NavLink
                                                    to={`/admin/${invoice?.orderId}/order`}
                                                    className="btn btn-light"
                                                    >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-journal-text" viewBox="0 0 16 16">
                                                        <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                                                        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
                                                        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
                                                    </svg>
                                                </NavLink> : null}
                                            </td>
                                            <td>{invoice?.orderId > 0 ?
                                                <a className="btn btn-outline-danger" style={{ border: 'none' }}
                                                    onClick={() => delBtnHandle(invoice?.cdStatus, invoice?.orderId)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                    </svg>
                                                </a> : ''
                                            }
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>

                        <div className="d-flex justify-content-center">
                            <Pagination>
                                <Pagination.Prev
                                    onClick={() => { 
                                        const num = pageInfo.startPageNum - 1
                                        setFilterCon({...filterCon, pnum: num})
                                        navigate(`/admin/order-list?page=${num}&status=${filterCon.status}&strDate=${filterCon.strDate}&endDate=${filterCon.endDate}`);
                                        }}
                                    disabled={pageInfo.startPageNum === 1} />
                                {pageArr.map((num) => (
                                    <Pagination.Item key={num}
                                        onClick={() => {
                                            setFilterCon({...filterCon, pnum: num})
                                            navigate(`/admin/order-list?page=${num}&status=${filterCon.status}&strDate=${filterCon.strDate}&endDate=${filterCon.endDate}`);
                                        }}
                                        active={pageInfo.pageNum === num}>
                                        {num}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    onClick={() => {
                                        const num = pageInfo.endPageNum + 1
                                        setFilterCon({...filterCon, pnum: num})
                                        navigate(`/admin/order-list?page=${num}&status=${filterCon.status}&strDate=${filterCon.strDate}&endDate=${filterCon.endDate}`);
                                        }}
                                    disabled={pageInfo.endPageNum >= pageInfo.totalPageCount} />
                            </Pagination>
                        </div>
                    </Container>
                </div>
            </div>
        </>
    );
} export default OrderList;