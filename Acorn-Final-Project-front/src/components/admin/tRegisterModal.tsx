import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import api from '@/api';


// 등록 모달 props 타입
interface RegisterModalProps {
    show: boolean;
    onClose: () => void;
    onRegister: () => void;
}

const RegisterModal:React.FC<RegisterModalProps> = ({ show, onClose, onRegister }) => {
    const [name, setName] = useState<string>("");  
    const [birth, setBirth] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [cdStatus, setCdStatus] = useState<string>("");
    const [isInvalid, setIsInvalid] = useState<boolean | null>(null);
    const [salary, setSalary] = useState<string>("");
    // const userId = '2'; // userId 데이터 불러오기
    // const storeName='스토어1'; // storeName 데이터 불러오기
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user.userId; 
    const storeName = user.storeName;
    
    // 유효성 검사 결과에 따라 버튼 활성화
    const isFormValid = name.trim() !== "" && birth.trim() !== "" && phone.trim().length > 8 && cdStatus !== "" && salary.trim() !== '' && isInvalid === false;
    
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

    // 급여 형식 포맷 (3자리마다 , 표시)
  const formatSalary = (value: string): string => {
    const onlyNum = value.replace(/[^0-9]/g, ''); // 입력값 중 숫자만
    return onlyNum ? Number(onlyNum).toLocaleString() : '';
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSalary(e.target.value);
    setSalary(formatted);
    // setForm(prev => ({ ...prev, salary: formatted }));
  };

  // 디바운스 방식으로 중복 체크
  useEffect(() => {
    const timeout = setTimeout(() => {
      
      if (phone.length > 8) {
        api.get(`/teachers/phone-check?phone=${phone}`)
          .then((res) => setIsInvalid(res.data)) // true or false
          .catch((err) => console.error("중복 체크 오류:", err));
      }
    }, 500); // 0.5초 후 체크

    return () => clearTimeout(timeout); // 초기화
  }, [phone]);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //폼 제출 방지
        if(isInvalid === true || phone.length < 9) {
            alert("연락처를 확인해 주십시오");
            return;
        }

        const formData = new FormData(e.currentTarget);
        const formObject = Object.fromEntries(formData.entries());
        formObject.userId = userId;
        formObject.salary = salary.replace(/[^0-9]/g, '');

        console.log(formObject);
        

        api.post('/teachers', formObject)
            .then(res => {
                console.log(res.data);
                alert("강사 정보를 등록했습니다");
                onRegister();
                onClose();
            })
            .catch(err => {
                console.log(err);
                alert("강사 정보 등록에 실패했습니다");
            });
    };
    
    return (
        <Modal show={show} onHide={onClose} centered> {/* 모달 닫힐 때 부모 컴포넌트에서 실행될 함수 onClose */}
            <Modal.Header closeButton> {/* 닫기 버튼 누르면 onHide 호출 */}
                <Modal.Title>강사 정보 등록</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}> {/* 폼에 함수 연결 */}
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>지점명</Form.Label>
                        <Form.Control name="storeName" value={storeName} readOnly />
                        {/* storename 가져오기 */}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>강사명</Form.Label>
                        <Form.Control name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="강사명을 입력하세요" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>생년월일</Form.Label>
                        <Form.Control name="birth" type="date" onChange={(e) => setBirth(e.target.value)}/>
                        {/* <Form.Control name="birth" placeholder="생년월일을 입력하세요" required /> */}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>연락처(예: 01012345678)</Form.Label>
                        <Form.Control name="phone" value={phone} onChange={handlePhoneChange} placeholder="연락처를 입력하세요" /> {/* 포커스를 잃었을 때 유효성 체크 */}
                        {isInvalid === true && <span style={{ color: "red" }}>이미 사용 중인 번호입니다.</span>}
                        {isInvalid === false && <span style={{ color: "green" }}>사용 가능한 번호입니다.</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>재직 여부</Form.Label>
                        <Form.Select name="cdStatus" value={cdStatus} onChange={(e) => setCdStatus(e.target.value)}>
                            <option value="">상태를 선택하세요</option>
                            <option value="WORK">재직</option>
                            <option value="T_QUIT">퇴직</option>
                        </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>급여</Form.Label>
                        <Form.Control name="salary" placeholder="급여를 입력하세요" value={salary} onChange={handleSalaryChange} />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }} disabled={!isFormValid}>등록</Button> {/* 등록 버튼에 onClick 등록하지 않음 */}
                </Modal.Footer> {/* 폼 안에 버튼 포함 */}
            </Form>
        </Modal>
    );
}

export default RegisterModal;