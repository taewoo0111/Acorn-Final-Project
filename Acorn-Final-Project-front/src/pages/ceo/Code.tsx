import React, { useEffect, useState } from 'react';
import api from '../../api';
import { v4 as uuid } from 'uuid';
import { Button, Modal, Form, Table, Container, Row, Col } from 'react-bootstrap';

interface Code {
  acode: string;
  aname: string;
  bcode: string;
  bname: string;
}

function AcodeModal({ show, onHide, onSubmit }: {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: { acode: string; aname: string }) => void;
}) {
  const [acode, setAcode] = useState('');
  const [aname, setAname] = useState('');

  const handleSubmit = () => {
    if (!acode || !aname) return alert('모든 항목을 입력하세요.');
    onSubmit({ acode, aname });
    setAcode('');
    setAname('');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton><Modal.Title>코드 등록</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>코드</Form.Label>
            <Form.Control type="text" value={acode} onChange={e => setAcode(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>코드 이름</Form.Label>
            <Form.Control type="text" value={aname} onChange={e => setAname(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>취소</Button>
        <Button variant="primary" onClick={handleSubmit}>등록</Button>
      </Modal.Footer>
    </Modal>
  );
}

function BcodeModal({ show, onHide, onSubmit, acode }: {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: { acode: string, bcode: string; bname: string }) => void;
  acode: string;
}) {
  const [bcode, setBcode] = useState('');
  const [bname, setBname] = useState('');

  const handleSubmit = () => {
    if (!bcode || !bname) return alert('모든 항목을 입력하세요.');
    onSubmit({ acode, bcode, bname });
    setBcode('');
    setBname('');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton><Modal.Title>상태 등록</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>코드 네임</Form.Label>
            <Form.Control type="text" value={acode} readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>상태 코드</Form.Label>
            <Form.Control type="text" value={bcode} onChange={e => setBcode(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>상태 이름</Form.Label>
            <Form.Control type="text" value={bname} onChange={e => setBname(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>취소</Button>
        <Button variant="primary" onClick={handleSubmit}>등록</Button>
      </Modal.Footer>
    </Modal>
  );
}

function Code() {
  const [acodes, setAcodes] = useState<Code[]>([]);
  const [bcodes, setBcodes] = useState<Code[]>([]);
  const [selectedAcode, setSelectedAcode] = useState('');
  const [showAcodeModal, setShowAcodeModal] = useState(false);
  const [showBcodeModal, setShowBcodeModal] = useState(false);

  const refreshAcodes = () => {
    api.get('/acode')
      .then(res => {
        setAcodes(res.data);
        if (res.data.length > 0) {
          const first = res.data[0].acode;
          setSelectedAcode(first);
          refreshBcodes(first);
        } else {
          setSelectedAcode('');
          setBcodes([]);
        }
      })
      .catch(console.error);
  };

  const refreshBcodes = (acode: string) => {
    setSelectedAcode(acode);
    api.get(`/bcode/${acode}`).then(res => setBcodes(res.data)).catch(console.error);
  };

  const handleDeleteAcode = (acode: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      api.patch(`/acode/${acode}`).then(refreshAcodes).catch(console.error);
    }
  };

  const handleDeleteBcode = (bcode: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      api.patch(`/bcode/${bcode}`).then(() => refreshBcodes(selectedAcode)).catch(console.error);
    }
  };

  useEffect(() => {
    refreshAcodes();
  }, []);

  return (
    <>
      
      <Container className="mt-4">
        <h2 className="mb-4">코드 관리</h2>
        <Row>
          <Col md={6}>
            <div className="border p-3 rounded">
              <div className="d-flex justify-content-between mb-2">
                <strong>A코드</strong>
                <Button size="sm" onClick={() => setShowAcodeModal(true)}>코드 등록</Button>
              </div>
              <Table bordered className="text-center">
                <thead className="table-secondary text-center">
                  <tr>
                    <th>그룹</th>
                    <th>코드네임</th>
                    <th>DEL</th>
                  </tr>
                </thead>
                <tbody>
                  {acodes.map(item => (
                    <tr key={uuid()}
                        onClick={() => refreshBcodes(item.acode)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: selectedAcode === item.acode ? '#e7f3ff' : 'white'
                        }}>
                      <td>{item.acode}</td>
                      <td>{item.aname}</td>
                      <td className="text-center">
                        <Button variant="danger" size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteAcode(item.acode);
                          }}>DEL</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col md={6}>
            <div className="border p-3 rounded">
              <div className="d-flex justify-content-between mb-2">
                <strong>B코드</strong>
                <Button size="sm" variant="success" onClick={() => setShowBcodeModal(true)}>코드 등록</Button>
              </div>
              <Table bordered className="text-center">
                <thead className="table-secondary text-center">
                  <tr>
                    <th>소그룹</th>
                    <th>코드네임</th>
                    <th>DEL</th>
                  </tr>
                </thead>
                <tbody>
                  {bcodes.map((item) => (
                    <tr key={uuid()}>
                      <td>{item.bcode}</td>
                      <td>{item.bname}</td>
                      <td className="text-center">
                        <Button variant="danger" size="sm" onClick={() => handleDeleteBcode(item.bcode)}>DEL</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
      <AcodeModal show={showAcodeModal} onHide={() => setShowAcodeModal(false)} onSubmit={(data) => api.post('/acode', data).then(refreshAcodes)} />
      <BcodeModal
        show={showBcodeModal}
        onHide={() => setShowBcodeModal(false)}
        onSubmit={(data) => api.post('/bcode', data).then(() => refreshBcodes(selectedAcode))}
        acode={selectedAcode}
      />
    </>
  );
}

export default Code;
