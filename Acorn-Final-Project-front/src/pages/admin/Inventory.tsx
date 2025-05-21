import { useEffect, useState } from 'react';
import InvList from '../../components/admin/InvList';
import InvDetail from '../../components/admin/InvDetail';
import api from '../../api';
import type { InventoryItemDetail, InventoryItemList } from '../../types/InventoryType';


function Inventory() {

    // 검색 필터
    const [filterType, setFilterType] = useState('');
    // 검색어
    const [keyword, setKeyword] = useState('');
    // 검색 결과
    const [filteredData, setFilteredData] = useState<InventoryItemList[]>([]);

    // 재고 목록 가져오기
    const refreshList = () => {
        api.get(`/inv?condition=${filterType}&keyword=${keyword}`)
            .then(res => {
                console.log(res.data);  
                setFilteredData(res.data.list)
            })
            .catch(err => console.log(err));
    }

    // 사용 내역을 보여줄 품목 아이디
    const [pId, setPId] = useState<number>(0);
    // 조회 시작 날짜
    const [strDate, setStrDate] = useState<string>('');
    // 조회 끝 날짜
    const [endDate, setEndDate] = useState<string>('');
    // 조회 결과
    const [itemDetail, setItemDetail] = useState<InventoryItemDetail[]>([]);

    // 사용 내역을 가져오는 함수
    const refreshDetail = () => {
        //첫 페이지 로딩시 선탣된 값 없으니 pId 0 일 경우 제외
        if (pId == 0) return;
        api.get(`/inv/${pId}?strDate=${strDate}&endDate=${endDate}`)
            .then(res => {
                // console.log(res.data);
                setItemDetail(res.data.list)
            })
            .catch(err => console.log(err));
    }

    // 선택한 품목 아이디가 바뀐 경우
    useEffect(() => {
        if (pId !== undefined && pId !== null) {
            refreshDetail();
        }
    }, [pId]);

    // 컴포넌트 활성화 시
    useEffect(() => {
        refreshList();
    }, []);

    return (
        <div className="flex">
            <div style={{ flex: 1, margin: '1rem 3rem' }} >
                <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                    <div style={{ width: '50%' }}>
                        <InvList
                            setPId={setPId}
                            filterType={filterType}
                            setFilterType={setFilterType}
                            keyword={keyword}
                            setKeyword={setKeyword}
                            filteredData={filteredData}
                            setFilteredData={setFilteredData}
                            refreshList={refreshList}
                            context="inventory"
                        ></InvList>
                    </div>
                    <div style={{ width: '50%' }}>
                        <InvDetail
                            refreshDetail={refreshDetail}
                            strDate={strDate}
                            endDate={endDate}
                            setStrDate={setStrDate}
                            setEndDate={setEndDate}
                            itemDetail={itemDetail}
                            refreshList={refreshList}
                        ></InvDetail>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inventory;