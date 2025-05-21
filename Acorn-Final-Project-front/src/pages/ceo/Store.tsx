import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Pagination, Table, Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Store {
  userId: number;
  storeName: string;
  storeCall: string;
  userName: string;
  phone: string;
  id: string;
}

interface StoreListDto {
  list: Store[];
  pageNum: number;
  startPageNum: number;
  endPageNum: number;
  totalPageCount: number;
  totalRow: number;
}

function Store() {
  const [params] = useSearchParams();
  const [searchState, setSearchState] = useState({ condition: '', keyword: '' });
  const [storeListDto, setStoreListDto] = useState<StoreListDto>({
    list: [],
    pageNum: 1,
    startPageNum: 1,
    endPageNum: 1,
    totalPageCount: 1,
    totalRow: 0
  });
  const [modalType, setModalType] = useState<'edit' | 'add' | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [form, setForm] = useState<any>({});

  const navigate = useNavigate();

  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const refresh = (pageNum: number) => {
    const condition = params.get('condition') || '';
    const keyword = params.get('keyword') || '';
    const query = `condition=${condition}&keyword=${keyword}`;
    api.get(`/store?pageNum=${pageNum}&${query}`).then(res => setStoreListDto(res.data));
  };

  useEffect(() => {
    const pageNum = parseInt(params.get('pageNum') || '1');
    refresh(pageNum);
  }, [params]);

  const move = (pageNum: number) => {
    const query = new URLSearchParams(searchState).toString();
    navigate(`/ceo/store?pageNum=${pageNum}&${query}`);
    refresh(pageNum);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openEdit = (store: Store) => {
    setSelectedStore(store);
    setForm(store);
    setModalType('edit');
  };

  const openAdd = () => {
    setForm({});
    setModalType('add');
  };

  const submitForm = () => {
    const apiCall = modalType === 'add'
      ? api.post('/store', form)
      : api.patch(`/store/${selectedStore!.userId}`, form);

    apiCall.then(() => {
      alert(modalType === 'add' ? '등록 완료' : '수정 완료');
      setModalType(null);
      refresh(storeListDto.pageNum);
    });
  };

  const deleteStore = () => {
    const pwd = prompt('본사 관리자 비밀번호를 입력하세요');
    if (!pwd || !selectedStore) return;

    api.delete(`/store/${selectedStore.userId}?adminPwd=${pwd}`)
      .then(() => {
        alert('삭제 완료');
        setModalType(null);
        refresh(storeListDto.pageNum);
      })
      .catch(err => {
        if (err.response?.status === 403) {
          alert('관리자 비밀번호가 일치하지 않습니다.');
        } else {
          alert('삭제 중 오류가 발생했습니다.');
        }
      });
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">지점 관리</h2>
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
        <Col><Button onClick={openAdd}>지점 등록</Button></Col>
        <Col md="auto">
          <Form.Select name="condition" onChange={(e) => setSearchState({ ...searchState, condition: e.target.value })}>
            <option value="all">전체</option>
            <option value="storeName">지점명</option>
            <option value="userName">원장명</option>
          </Form.Select>
        </Col>
        <Col><Form.Control name="keyword" placeholder="검색어" onChange={(e) => setSearchState({ ...searchState, keyword: e.target.value })} /></Col>
        <Col md="auto"><Button onClick={() => move(1)} variant="success">검색</Button></Col>
      </Row>

      <Table bordered hover className="text-center">
        <thead className="table-secondary">
          <tr>
            <th>지점명</th>
            <th>지점 전화번호</th>
            <th>원장</th>
            <th>원장 번호</th>
          </tr>
        </thead>
        <tbody>
          {storeListDto.list.map(item => (
            <tr key={item.userId}>
              <td onClick={() => openEdit(item)} style={{ cursor: 'pointer' }}>{item.storeName}</td>
              <td>{item.storeCall}</td>
              <td>{item.userName}</td>
              <td>{item.phone}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center">
        <Pagination>
          <Pagination.Item onClick={() => move(storeListDto.startPageNum - 1)} disabled={storeListDto.startPageNum === 1}>Prev</Pagination.Item>
          {range(storeListDto.startPageNum, storeListDto.endPageNum).map(page => (
            <Pagination.Item key={page} onClick={() => move(page)} active={storeListDto.pageNum === page}>{page}</Pagination.Item>
          ))}
          <Pagination.Item onClick={() => move(storeListDto.endPageNum + 1)} disabled={storeListDto.endPageNum >= storeListDto.totalPageCount}>Next</Pagination.Item>
        </Pagination>
      </div>

      <Modal show={modalType !== null} onHide={() => setModalType(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? '지점 등록' : '지점 수정'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Control name="storeName" placeholder="지점명" value={form.storeName || ''} onChange={handleChange} readOnly={modalType === 'edit'} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control name="storeCall" placeholder="전화번호" value={form.storeCall || ''} onChange={handleChange} readOnly={modalType === 'edit'} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control name="userName" placeholder="원장명" value={form.userName || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control name="phone" placeholder="원장 전화번호" value={form.phone || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control name="id" placeholder="로그인 ID" value={form.id || ''} onChange={handleChange} readOnly={modalType === 'edit'} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control name="pwd" type="password" placeholder="비밀번호" value={form.pwd || ''} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {modalType === 'edit' && <Button variant="danger" onClick={deleteStore}>삭제</Button>}
          <Button variant="primary" onClick={submitForm}>{modalType === 'add' ? '등록' : '수정'}</Button>
          <Button variant="secondary" onClick={() => setModalType(null)}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Store;
