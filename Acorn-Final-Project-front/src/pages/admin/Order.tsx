import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import InvList from '../../components/admin/InvList';
import OrdDetail from '../../components/admin/OrdDetail';
import api from '../../api';
import { InventoryItemList } from '../../types/InventoryType';
import PrdList from '../../components/admin/PrdList';
import { OrderItem } from '../../types/OrderType';
import { useParams } from 'react-router-dom';

function Order() {
    // 경로 파라미터의 :id 값 추출 (params.id)
    const params = useParams();

    /* 품목 현황*/
    // 추가할 발주 품목 정보
    const [orderItem, setOrderItem] = useState<OrderItem>({
        productId: 0,
        productName: '',
        price: 0,
        quantity: 0,
        calPrice: 0,
        cdCategory: ''
    });

    // 발주 품목 추가 버튼 클릭 여부
    const [clickCnt, setClickCnt] = useState<number>(0);

    /* 재고 현황*/
    // 검색 필터
    const [filterType, setFilterType] = useState<string>('');
    // 검색어
    const [keyword, setKeyword] = useState<string>('');
    // 검색 결과
    const [filteredData, setFilteredData] = useState<InventoryItemList[]>([]);
    // 조건에 맞는 재고 목록 가져오기
    const refreshInvList = () => {
        api.get(`/inv?condition=${filterType}&keyword=${keyword}`)
            .then(res => {
                console.log(res.data);
                setFilteredData(res.data.list)
            })
            .catch(err => console.log(err));
    }

    // 컴포넌트 활성화 시
    useEffect(() => {
        // 재고 현황 불러오기
        refreshInvList();
    }, []);

    return (
        <><div className="flex">
            {/* <div style={{ flex: 1, margin: '5rem 10rem' }} ></div> */}
            {/* <pre>{JSON.stringify(orderItem,null,4)}</pre> */}
            <div style={{ flex: 1, margin: '5rem 5rem' }} >
            <Container fluid className="p-4" >
                <Row>
                    <Col xs={4} >
                        <div>
                            <PrdList
                                setOrderItem={setOrderItem}
                                clickCnt={clickCnt}
                                setClickCnt={setClickCnt}
                            ></PrdList>
                        </div>
                        <div className='pt-3'>
                            <InvList
                                setPId={null}
                                filterType={filterType}
                                setFilterType={setFilterType}
                                keyword={keyword}
                                setKeyword={setKeyword}
                                filteredData={filteredData}
                                setFilteredData={setFilteredData}
                                refreshList={refreshInvList}
                                context="order"
                            ></InvList>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <OrdDetail
                                orderItem={orderItem}
                                clickCnt={clickCnt}
                                orderId={params.id}
                            ></OrdDetail>
                        </div>
                    </Col>
                </Row>
            </Container>
            </div>
        </div>
        </>
    );
}

export default Order;