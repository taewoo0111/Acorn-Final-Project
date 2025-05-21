import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import type { InvListProps } from '../../types/InventoryType';
import './InvOrdStyle.css';
import {v4 as uuid} from "uuid";

function InvList({   
    setPId,
    setFilterType,
    keyword,
    setKeyword,
    filteredData,
    refreshList,
    context }:InvListProps) {


    // 검색 버튼 핸들러
    const handleSearch = () => {
        refreshList();
    };

    // 행 클릭 핸들러
    const handleClick = (productId: number) => {
        // console.log('선택된 품목 ID:', productId);
        setPId!(productId);
    }

    return (
        <>
            <div className={`${context === 'order' ? '' : 'div-inv-detail'} bg-gray p-4`}>
                <h3 className="mb-4 fw-bold text-center">재고 현황</h3>
                <Row className="mb-3">
                    <Col xs="auto">
                        <Form.Select onChange={(e) => setFilterType(e.target.value)} defaultValue="all">
                            <option value="">전체</option>
                            <option value="pid">품목 코드</option>
                            <option value="pname">품목명</option>
                            <option value="ctg">카테고리</option>
                        </Form.Select>
                    </Col>
                    <Col xs>
                        <Form.Control
                            type="text"
                            placeholder="검색어 입력..."
                            value={keyword ?? ''}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button style={{ backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }} onClick={handleSearch}>검색</Button>
                    </Col>
                </Row>
                
                <div style={context !== 'order' ? { cursor: 'pointer' } : {}}
                    className={`table-wrapper${context === 'order' ? '-order ' : ''} text-center`}>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>카테고리</th>
                                <th>품목 코드</th>
                                <th>품목명</th>
                                <th>현재 재고</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item) => (
                                <tr key={uuid()}
                                    onClick={() => handleClick(item.productId)}>
                                    <td>{item.cdCategory}</td>
                                    <td>{item.productId}</td>
                                    <td>{item.productName}</td>
                                    <td>{item.qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    );
}

export default InvList;