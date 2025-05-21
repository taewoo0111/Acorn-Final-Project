import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import api from '../../api';

interface Student {
    studentId: number;
    name: string;
    phone: string;
    cdStatus: string;
    statusName: string;
    storeName: string;
    classNames: string;
}

interface UpdateModalProps {
    student: Student;
    show: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ student, show, onClose, onUpdate }) => {
    const [phone, setPhone] = useState("");
    const [isInvalid, setIsInvalid] = useState<boolean | null>(null);
    const [form, setForm] = useState({ ...student });
    const [isFormValid, setIsFormValid] = useState<boolean | null>(false); // 입력값 유효성 검사
    const studentId = student.studentId;
    const [isActive, setIsActive] = useState<boolean | null>(false); // 수강 수업 있는지 여부

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
    setForm(prev => ({ ...prev, phone: formattedPhone })); // form.phone 에 전화번호 업데이트
    setIsInvalid(null); // 수정 시 중복 상태(isInvalid) 초기화
  };

  // 입력 필드 값 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // 유효성 검사 (+ 전화번호 중복 체크까지)
  useEffect(() => {
    const isAllValid = 
      form.name.trim() !== '' &&
      form.phone.trim().length > 8 &&
      form.cdStatus.trim() !== '' &&
      isInvalid !== true;

    setIsFormValid(isAllValid);
  }, [form, isInvalid]);

  // 전화번호 중복 체크
  useEffect(() => {
    const timeout = setTimeout(() => {

      if (phone === student.phone) return; // 자기 번호일 경우 중복 체크 생략
      if (phone.length > 8 && phone !== student.phone)  {
        api.get(`/students/phone-check?phone=${phone}`)
          .then((res) => setIsInvalid(res.data)) // true or false
          .catch((err) => console.error("중복 체크 오류:", err));
      }
    }, 500); // 0.5초 후 체크

    return () => clearTimeout(timeout); // 타이머 초기화
  }, [phone]);

  // student prop 변경 시 form 초기화
  useEffect(() => {
    setForm({ ...student });
    setPhone(student.phone);
    setIsInvalid(null);
    setIsActive(!!student.classNames); // 수강 수업 있는 경우 true
  }, [student]);
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(isInvalid === true || form.phone.length < 9) {
            alert("연락처를 확인해 주십시오");
            return;
        }
    /*
        const formData = new FormData(e.currentTarget);
        const formObject = Object.fromEntries(formData.entries());
        formObject.phone = form.phone;
    */    
        const formObject = {
            name: form.name,
            phone: form.phone,
            cdStatus: form.cdStatus,
        };

        api.patch(`/students/${studentId}`, formObject)
            .then((res) => {
                console.log(res.data);
                onUpdate();
                alert("학생 정보를 수정했습니다");
                onClose();
            })
            .catch(err => {
                console.log(err);
                alert("학생 정보 수정 실패했습니다");
            });    
    };

    useEffect(() => {
        setForm({ ...student });
    }, [student]);

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>학생 정보 수정</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>지점명</Form.Label>
                        <Form.Control name="storeName" value={form.storeName} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>학생명</Form.Label>
                        <Form.Control name="name" value={form.name} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>연락처 (예: 01012345678)</Form.Label>
                        <Form.Control name="phone" value={form.phone} onChange={handlePhoneChange} maxLength={13} />
                        {isInvalid === true && <span style={{ color: "red" }}>이미 사용 중인 번호입니다.</span>}
                        {isInvalid === false && <span style={{ color: "green" }}>사용 가능한 번호입니다.</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>재원 여부</Form.Label>
                        <Form.Select name="cdStatus" value={form.cdStatus} onChange={handleChange} disabled={isActive}>
                            <option value="STUDY">재원</option>
                            <option value="S_QUIT">퇴원</option>
                        </Form.Select>
                        {isActive && (
                          <span style={{ color: 'gray', fontSize: '0.9em' }}>
                            현재 수강 수업이 있는 학생은 재원 상태를 변경할 수 없습니다.
                          </span>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }} disabled={!isFormValid}>수정</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default UpdateModal;
