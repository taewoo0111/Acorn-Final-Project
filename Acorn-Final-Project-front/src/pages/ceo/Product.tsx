import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Table, Button, Form, Modal, Pagination, Row, Col, Container } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CeoNavbar from '@/components/CeoNavBar';

interface Product {
  productId: number;
  productName: string;
  cdCategory: string;
  price: number;
}

interface ProductListDto {
  list: Product[];
  pageNum: number;
  startPageNum: number;
  endPageNum: number;
  totalPageCount: number;
  totalRow: number;
  keyword?: string;
}

function Product() {
  const [productList, setProductList] = useState<ProductListDto>({
    list: [],
    pageNum: 1,
    startPageNum: 1,
    endPageNum: 1,
    totalPageCount: 1,
    totalRow: 0,
    keyword: ''
  });
  const [params] = useSearchParams();
  const [pageArray, setPageArray] = useState<number[]>([]);
  const [searchState, setSearchState] = useState({
    condition: '',
    keyword: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    productId: 0,
    productName: '',
    cdCategory: 'BOOK',
    price: ''
  });
  const navigate = useNavigate();

  const refresh = (pageNum: number) => {
    const condition = params.get('cdCategory') || '';
    const keyword = params.get('keyword') || '';

    let query = '';
    if (condition) query += `cdCategory=${condition}`;
    if (keyword) {
      if (query) query += '&';
      query += `keyword=${keyword}`;
    }

    api.get(`/product?pageNum=${pageNum}${query ? '&' + query : ''}`)
      .then(res => {
        setProductList(res.data);
        setPageArray(range(res.data.startPageNum, res.data.endPageNum));
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    const pageNum = parseInt(params.get("pageNum") || "1");
    refresh(pageNum);
  }, [params]);

  const range = (start: number, end: number) => {
    const result: number[] = [];
    for (let i = start; i <= end; i++) result.push(i);
    return result;
  };

  const move = (pageNum: number) => {
    let query = '';
    if (searchState.condition) query += `cdCategory=${searchState.condition}`;
    if (searchState.keyword) {
      if (query) query += '&';
      query += `keyword=${searchState.keyword}`;
    }
    const newUrl = `/ceo/product?pageNum=${pageNum}${query ? '&' + query : ''}`;
    navigate(newUrl);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchState({
      ...searchState,
      [e.target.name]: e.target.value
    });
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.productName || !form.price) return alert('모든 항목을 입력해주세요!');
    const payload = {
      productName: form.productName,
      cdCategory: form.cdCategory,
      price: Number(form.price)
    };
    const request = isEdit
      ? api.patch(`/product/${form.productId}`, { price: payload.price })
      : api.post('/product', payload);
    request
      .then(() => {
        alert(isEdit ? '수정 완료!' : '등록 완료!');
        setShowModal(false);
        refresh(productList.pageNum);
      })
      .catch(error => {
        console.error(error);
        alert(isEdit ? '수정 실패!' : '등록 실패!');
      });
  };

  const openEditModal = (item: Product) => {
    setForm({
      productId: item.productId,
      productName: item.productName,
      cdCategory: item.cdCategory,
      price: String(item.price)
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = (productId: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    api.delete(`/product/${productId}`)
      .then(() => {
        alert("삭제 완료!");
        refresh(productList.pageNum);
        setShowModal(false);
      })
      .catch(error => {
        console.error(error);
        alert("삭제 실패!");
      });
  };

  return (
      <Container className="mt-4">
        <h2 className="mb-4">품목 관리</h2>
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
        <Row className="mb-3 align-items-center">
          <Col><Button onClick={() => {
            setShowModal(true);
            setIsEdit(false);
            setForm({ productId: 0, productName: '', cdCategory: 'BOOK', price: '' });
          }}>품목 등록</Button></Col>
          <Col md="auto">
            <Form.Select name="condition" value={searchState.condition} onChange={handleSearchChange}>
              <option value="">전체</option>
              <option value="BOOK">서적</option>
              <option value="EQUIPMENT">기자재</option>
              <option value="P_ETC">기타</option>
            </Form.Select>
          </Col>
          <Col><Form.Control type="text" name="keyword" value={searchState.keyword} onChange={handleSearchChange} placeholder="품목명 검색" /></Col>
          <Col md="auto">
            <Button onClick={() => move(1)} variant="success">검색</Button>{' '}
          </Col>
        </Row>

        <Table bordered hover className="text-center">
          <thead className="table-secondary text-center">
            <tr>
              <th>품목 코드</th>
              <th>품목 명</th>
              <th>가격</th>
            </tr>
          </thead>
          <tbody>
            {productList.list.map(item => (
              <tr key={item.productId}>
                <td>{item.cdCategory}</td>
                <td onClick={() => openEditModal(item)} style={{ cursor: 'pointer' }}>{item.productName}</td>
                <td>{item.price.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.Item onClick={() => move(productList.startPageNum - 1)} disabled={productList.startPageNum === 1}>Prev</Pagination.Item>
            {pageArray.map(item => (
              <Pagination.Item key={item} active={productList.pageNum === item} onClick={() => move(item)}>{item}</Pagination.Item>
            ))}
            <Pagination.Item onClick={() => move(productList.endPageNum + 1)} disabled={productList.endPageNum === productList.totalPageCount}>Next</Pagination.Item>
          </Pagination>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{isEdit ? '품목 수정' : '품목 등록'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>카테고리</Form.Label>
              <Form.Select name="cdCategory" value={form.cdCategory} onChange={handleModalChange} disabled={isEdit}>
                <option value="BOOK">서적</option>
                <option value="EQUIPMENT">기자재</option>
                <option value="P_ETC">기타</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>품목명</Form.Label>
              <Form.Control name="productName" value={form.productName} onChange={handleModalChange} disabled={isEdit} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>가격</Form.Label>
              <Form.Control type="number" name="price" value={form.price} onChange={handleModalChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {isEdit && <Button variant="danger" onClick={() => handleDelete(form.productId)}>삭제</Button>}
            <Button variant="primary" onClick={handleSubmit}>{isEdit ? '수정' : '등록'}</Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>닫기</Button>
          </Modal.Footer>
        </Modal>
      </Container>
  );
}

export default Product;
