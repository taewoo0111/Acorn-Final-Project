import { Button, FloatingLabel, Modal, Form, Row, Col } from "react-bootstrap";
import api from "../../api";
import { useEffect, useState } from "react";
import { cdLecture, ClassItem, teacherlist } from "../../types/ClassType";

function ClassAddModal(props) {

    const initialClassAddInfo: ClassItem = {
        classId: 0,
        className: "",
        cdLecture: "",
        userId: 0,
        teacherId: 0,
        teacherName: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        weekday: "0000000",
        currentStudent: 0,
        maxStudent: 0,
        price: 0,
        applyStartDate: "",
        applyEndDate: "",
        cdStatus: "",
        description: ""
    };

    const [classAddInfo, setclassAddInfo] = useState<ClassItem>(initialClassAddInfo);

    const [lecture, setlecture] = useState<cdLecture[]>([]);
    const [teacher, setTeacher] = useState<teacherlist[]>([]);

    //저장하기
    const handleSave = () => {
        console.log(classAddInfo)
        api.post('/class/add', classAddInfo)
        .then(res => {
            alert("수업이 개설되었습니다." );
            props.onHide();
        })
        .catch(error => {
            alert("수업개설에 실패했습니다." );
            props.onHide();
        });
    };      

    //강의분류 불러오기기
    const classLecture = ()=>{
        api.get(`/class/lecture`)
        .then(res=>{
            if (res.data){
                setlecture(res.data);
            };
        })
        .catch(error=>{
        });
    };

    //해당지점 수업가능한 강사 불러오기
    //class/teacher?userId=1
    const classteacher = (userId:number)=>{
        api.get(`/class/teacher?userId=${userId}`)
        .then(res=>{
            if (res.data){
                setTeacher(res.data);
            };
        })
        .catch(error=>{
        });
    };    

    useEffect(()=>{

        if (props.show) {
            setclassAddInfo({...initialClassAddInfo, userId: props.userId});
            classLecture()
            classteacher(props.userId);
        }
      }, [props.show]);
      

    // 요일 체크박스 문자열로변경
    const handleDayChange = (day, index) => {
        setclassAddInfo(prev => {
            const updatedWeekday = prev.weekday.split(''); //"0000000".split('') → ['0', '0', '0', '0', '0', '0', '0']
            updatedWeekday[index] = updatedWeekday[index] === '1' ? '0' : '1'; //체크박스 선택이랑해제
            return {
                ...prev,
                weekday: updatedWeekday.join('') // ['0', '1', '0', '1', '0', '0', '0'].join('') → '0101000'
            };
        });
    };

    //유효성검사 버튼 활성화
    const isFormValid = () => {
        return (
            classAddInfo.cdLecture !== "" &&
            classAddInfo.className.trim() !== "" &&
            classAddInfo.teacherId !== 0 &&
            classAddInfo.startDate !== "" &&
            classAddInfo.endDate !== "" &&
            classAddInfo.applyStartDate !== "" &&
            classAddInfo.applyEndDate !== "" &&
            classAddInfo.startTime !== "" &&
            classAddInfo.endTime !== "" &&
            classAddInfo.weekday.includes('1') &&
            classAddInfo.maxStudent > 0 &&
            classAddInfo.price > 0
        );
    };


    return (
        <Modal show={props.show} onHide={props.onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div> 수업개설 </div>
                </Modal.Title>
            </Modal.Header>


            <Modal.Body>

                <Row className="mb-3">
                    <Col xs="auto" className="d-flex align-items-center">
                        <div className="align-self-center">강의분류</div>
                    </Col>
                    <Col>
                        <Form.Control as="select" 
                            onChange={e => setclassAddInfo({...classAddInfo, cdLecture: e.target.value})}>
                            <option value="">강의분류를 선택해주세요</option>
                            {lecture.map((item, index) => (
                                <option key={index} value={item.bcode}> {item.bname} </option>
                            ))}
                        </Form.Control>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">수업명 &nbsp;&nbsp;</div>
                    </Col>
                    <Col>
                        <Form.Control type="text" 
                        onChange={e => setclassAddInfo({...classAddInfo, className: e.target.value})} />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col xs="auto" className="d-flex align-items-center">
                        <div className="align-self-center">담당강사</div>
                    </Col>
                    <Col>
                        <Form.Control as="select" 
                            onChange={e => setclassAddInfo({...classAddInfo, teacherId: Number(e.target.value)})}>
                            <option value="">강사를 선택해주세요</option>
                            {teacher.map((item, index) => (
                                <option key={index} value={item.teacherId}> {item.name} </option>
                            ))}
                        </Form.Control>
                    </Col>
                </Row>         

                <Row className="mb-3">
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">수업기간</div>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="startDate" label="교육 시작일">
                        <Form.Control type="date" 
                        onChange={e => setclassAddInfo({...classAddInfo, startDate: e.target.value})}/>
                        </FloatingLabel>
                    </Col>
                    <Col xs="auto" className="d-flex justify-content-center align-items-center">
                        <div><strong>~</strong></div>
                    </Col>                    
                    <Col>
                        <FloatingLabel controlId="endDate" label="교육 종료일">
                        <Form.Control type="date" 
                        onChange={e => setclassAddInfo({...classAddInfo, endDate: e.target.value})}/>
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">모집기간</div>
                    </Col>
                    <Col> 
                        <FloatingLabel controlId="applyStartDate" label="모집 시작일">
                        <Form.Control type="date" 
                        onChange={e => setclassAddInfo({...classAddInfo, applyStartDate: e.target.value})}/>
                        </FloatingLabel>
                    </Col>
                    <Col xs="auto" className="d-flex justify-content-center align-items-center">
                        <div><strong>~</strong></div>
                    </Col>                    
                    <Col>
                        <FloatingLabel controlId="applyEndDate" label="모집 종료일">
                        <Form.Control type="date" 
                        onChange={e => setclassAddInfo({...classAddInfo, applyEndDate: e.target.value})}/>
                        </FloatingLabel>
                    </Col>
                </Row>


                <Row className="mb-3">
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">수업시간</div>
                    </Col>
                    <Col> 
                        <Form.Control type="time" onChange={e => setclassAddInfo({...classAddInfo, startTime: e.target.value})}/>
                    </Col>
                    <Col xs="auto" className="d-flex justify-content-center align-items-center">
                        <div><strong>~</strong></div>
                    </Col>                    
                    <Col> 
                        <Form.Control type="time" onChange={e => setclassAddInfo({...classAddInfo, endTime: e.target.value})}/>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">요일&nbsp;&nbsp;&nbsp;</div>
                    </Col>
                    <Col>
                        {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                            <Form.Check inline type="checkbox" key={index} label={day}
                                checked={classAddInfo.weekday ? classAddInfo.weekday[index] === '1' : false}
                                onChange={() => handleDayChange(day, index)} // 요일 선택/해제
                            />
                        ))}

                    </Col>
                </Row>


                <Row className="mb-3">
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">모집총원</div>
                    </Col>
                    <Col>
                        <Form.Control type="text" onChange={e => setclassAddInfo({...classAddInfo, maxStudent: Number(e.target.value)})}/>
                    </Col>
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">수업료</div>
                    </Col>
                    <Col>
                        <Form.Control type="text" onChange={e => setclassAddInfo({...classAddInfo, price: Number(e.target.value)})}/>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">추가설명</div>
                    </Col>
                    <Col>
                        <Form.Control as="textarea" onChange={e => setclassAddInfo({...classAddInfo, description:e.target.value})}/>
                    </Col>
                </Row>



            </Modal.Body>

            <Modal.Footer>
                <Button style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }} onClick={handleSave} disabled={!isFormValid()}> 저장 </Button>			
            </Modal.Footer>
        </Modal>
    );
}

export default ClassAddModal;