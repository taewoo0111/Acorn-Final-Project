import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import api from '../../api';

interface RegisterModalProps {
    show: boolean;
    onClose: () => void;
    onRegister: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ show, onClose, onRegister }) => {
    const [name, setName] = useState<string>(""); 
    const [phone, setPhone] = useState<string>("");
    const [cdStatus, setCdStatus] = useState<string>("");
    const [isInvalid, setIsInvalid] = useState<boolean | null>(null);
    
    // const userId = '2'; // userId 데이터 불러오기
    // const storeName = '스토어1'; // storeName 데이터 불러오기
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user.userId; 
    const storeName = user.storeName;

    // 유효성 검사 결과에 따라 버튼 활성화
    const isFormValid = name.trim() !== "" && phone.length > 8 && cdStatus !== "" && isInvalid === false;


    // 전화번호 포맷 지정 
    const formatPhoneNumber = (value: string) => {
        let formatNum = '';
        const onlyNum = value.replace(/\D/g, ''); // 숫자만 
    
        if(onlyNum.length >= 11){    
            //formatNum = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            if (onlyNum.length < 4) return onlyNum;
            if (onlyNum.length < 8) return `${onlyNum.slice(0, 3)}-${onlyNum.slice(3)}`;
            formatNum = `${onlyNum.slice(0, 3)}-${onlyNum.slice(3, 7)}-${onlyNum.slice(7, 11)}`; // 자동 하이픈 삽입
        }else if(onlyNum.length==8){
            //formatNum = value.replace(/(\d{4})(\d{4})/, '$1-$2');
            if (onlyNum.length < 5) return onlyNum;
            formatNum = `${onlyNum.slice(0, 4)}-${onlyNum.slice(4, 8)}`;
        }else{    
            if(onlyNum.indexOf('02')==0){    
                //formatNum = value.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                if (onlyNum.length < 3) return onlyNum;
                if (onlyNum.length < 7) return `${onlyNum.slice(0, 2)}-${onlyNum.slice(2)}`;
                formatNum = `${onlyNum.slice(0, 2)}-${onlyNum.slice(2, 6)}-${onlyNum.slice(6, 10)}`;
            }else{        
                //formatNum = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                if (onlyNum.length < 4) return onlyNum;
                if (onlyNum.length < 7) return `${onlyNum.slice(0, 3)}-${onlyNum.slice(3)}`;
                formatNum = `${onlyNum.slice(0, 3)}-${onlyNum.slice(3, 6)}-${onlyNum.slice(6, 10)}`;
            }
    
        }

        return formatNum;   
        
    };

  // 전화번호 변경 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    if (formattedPhone.length > 13) return; // 최대 길이 13자리 제한 
    setPhone(formattedPhone);
    setIsInvalid(null); // 수정 시 중복 상태 초기화하여 isInvalid 상태값 실시간 반영
  };

  // 전화번호 중복 체크
  useEffect(() => {
    const timeout = setTimeout(() => {      
      if (phone.length > 8) {
        api.get(`/students/phone-check?phone=${phone}`)
          .then((res) => setIsInvalid(res.data)) // true or false
          .catch((err) => console.error("중복 체크 오류:", err));
      }
    }, 500); // 0.5초 후 체크

    return () => clearTimeout(timeout); // 초기화
  }, [phone]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(isInvalid === true || phone.length < 9) {
            alert("연락처를 확인해 주십시오");
            return;
        }
        const formData = new FormData(e.currentTarget);
        const formObject = Object.fromEntries(formData.entries());
        formObject.userId = userId;
        
        api.post('/students', formObject)
            .then((res) => {
                console.log(res.data);
                onRegister();
                alert("학생 정보를 등록했습니다");
                onClose();
            })
            .catch(err => {
                console.log(err);
                alert("학생 정보 등록 실패했습니다");
            });
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>학생 정보 등록</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>지점명</Form.Label>
                        <Form.Control name="storeName" value={storeName} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>학생명</Form.Label>
                        <Form.Control name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="학생명을 입력하세요" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>연락처 (예: 01012345678)</Form.Label>
                        <Form.Control name="phone" value={phone} onChange={handlePhoneChange} placeholder="연락처를 입력하세요" /> {/* 포커스를 잃었을 때 유효성 체크 */}
                        {isInvalid === true && <span style={{ color: "red" }}>이미 사용 중인 번호입니다.</span>}
                        {isInvalid === false && <span style={{ color: "green" }}>사용 가능한 번호입니다.</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>재원 여부</Form.Label>
                        <Form.Select name="cdStatus" value={cdStatus} onChange={(e) => setCdStatus(e.target.value)}>
                            <option value="">상태를 선택하세요</option>
                            <option value="STUDY">재원</option>
                            <option value="S_QUIT">퇴원</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }} disabled={!isFormValid}>등록</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default RegisterModal;
