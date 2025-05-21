import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, CloseButton, Dropdown, FloatingLabel, Form, ListGroup, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

function AdminSalesModal({show, title, btnTag, onBtn, onClose, initialData, userid}) {
    const [selectedBname, setSelectedBname] = useState('');
    const [selectedAname, setSelectedAname] = useState('');
    const [anamelist, setAnameList] = useState(["수입", "지출"])
    const [bnamelist, setBnameList] = useState([
        { class: "수입", detail: "수업수익" },
        { class: "수입", detail: "나머지수익" },
        { class: "지출", detail: "급여" },
        { class: "지출", detail: "발주" },
        { class: "지출", detail: "지출기타" }
    ]); 
    const [adminSaleId, setAdminSaleId] = useState<number|null>(null);
    const [price, setPrice] = useState(0);
    const [displayPrice, setDisplayPrice] = useState("0");
    const [saleName, setSaleName] = useState<string>('');
    //SaleName의 길이가 20자 이상일 경우 true로 설정
    const [isTooLong, setIsTooLong] = useState(false);
    const filteredBname = bnamelist.filter(item => item.class === selectedAname);
    useEffect(() => {
        resetState();
    }, [initialData, show]);
    const resetState = () => {
        if (initialData) {
            setSelectedAname(initialData.aname);
            setSelectedBname(initialData.bname);
            setSaleName(initialData.saleName);
            setPrice(initialData.price);
            setDisplayPrice(initialData.price.toLocaleString());
            // 👇 수정 버튼일 때만 adminSaleId 설정
            if (btnTag === "수정") {
                setAdminSaleId(initialData.adminSaleId);
            } else {
                setAdminSaleId(null);
            }
        } else {
            setSelectedAname('');
            setSelectedBname('');
            setSaleName('');
            setPrice(0);
            setDisplayPrice("0");
            setAdminSaleId(null);
        }
    };
    const handleClose=()=>{
        resetState();
        onClose();
    }
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, '');
        const number = parseInt(raw, 10);

        if (!isNaN(number)) {
            setPrice(number);
            setDisplayPrice(number.toLocaleString());
        } else {
            setPrice(0);
            setDisplayPrice("0");
        }
    };
    return (
        <>
            <Modal show={show} size="lg" centered>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                    <CloseButton onClick={handleClose}></CloseButton>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Group className="mb-3" controlId="aname">
                            <Form.Label>대분류</Form.Label>
                            <Form.Select value={selectedAname} onChange={((e)=>{
                                    setSelectedAname(e.target.value)
                            })}>
                                <option value='' disabled>구분</option>
                                {anamelist.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="bname">
                            <Form.Label>소분류</Form.Label>
                            <Form.Select value={selectedBname} onChange={(e)=>{setSelectedBname(e.target.value); }}>
                                <option value=''>구분</option>
                                {filteredBname.map((item, index) => (
                                    <option key={index} value={item.detail}>{item.detail}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="saleName">
                            <Form.Label>항목 내용</Form.Label>
                            <Form.Control value={saleName} type="text"  placeholder="수입/지출 항목 내용을 입력하세요" onChange={(e) => {setSaleName(e.target.value); }} />
                            <Form.Control.Feedback type="invalid">
                                한글 5자만 입력 가능합니다.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>매출 입력</Form.Label>
                            <Form.Control value={displayPrice} type="text"  placeholder="숫자 입력" onChange={handlePriceChange} />
                        </Form.Group>
                    </Form.Group>      
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                    style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }}
                    onClick={(e)=>{
                        e.preventDefault()    
                        onBtn({adminSaleId, selectedAname, selectedBname, saleName, price, userId:userid})
                    }}>{btnTag}</Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

export default AdminSalesModal;