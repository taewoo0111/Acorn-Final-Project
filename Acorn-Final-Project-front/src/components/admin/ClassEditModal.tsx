import { Button, FloatingLabel, Modal, Form, Row, Col } from "react-bootstrap";
import { cdLecture, ClassItem, teacherlist } from "../../types/ClassType";
import { useEffect, useState } from "react";
import api from "../../api";

function ClassEditModal(props) {
    const classId = props.classId //클래스 id가져오는거!

    const [classDetail, setclassDetail] = useState<ClassItem>({
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
        weekday: "",
        currentStudent: 0,
        maxStudent: 0,
        price: 0,
        applyStartDate: "",
        applyEndDate: "",
        cdStatus: "",
        description: ""
    });

    const [lecture, setlecture] = useState<cdLecture[]>([]);
    const [teacher, setTeacher] = useState<teacherlist[]>([]);    

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

    //수업정보 불러오기
    const classinfo = (classId:number)=>{
        api.get(`/class/detail?classId=${classId}`)
        .then(res=>{
            console.log(' 클래스정보!!:', res.data);
            if (res.data){
                delete res.data.description;
                //setclassDetail(res.data);
                setclassDetail(prev => ({
                    ...prev,
                    ...res.data
                }));
            };
        })
        .catch(error=>{
        });
    };

    //수업설명 불러오기기
    const classDescription = (classId:number)=>{
        api.get(`/class/description?classId=${classId}`)
        .then(res => {
            if (res.data) {
                setclassDetail(prev => ({
                    ...prev,
                    description: res.data.description
                }));
            }
        })
        .catch(error => {
        });
    };

    useEffect(()=>{
        if (props.show) {
            classinfo(classId);
            classLecture();
            classteacher(props.userId);
            classDescription(classId);
        }
      }, [props.show]);

      
    const handleSave = () => {
        api.patch('/class/update', classDetail)
        .then(res => {
            console.log("=================",classDetail)
            alert("수정 완료했습니다." );
            props.onHide();
        })
        .catch(error => {
            alert("수정 실패했습니다." );
            props.onHide();
        });
    };   

    // 요일 체크박스 문자열로변경
    const handleDayChange = (day, index) => {
        setclassDetail(prev => {
            const updatedWeekday = prev.weekday.split(''); //"0000000".split('') → ['0', '0', '0', '0', '0', '0', '0']
            updatedWeekday[index] = updatedWeekday[index] === '1' ? '0' : '1'; //체크박스 선택이랑해제
            return {
                ...prev,
                weekday: updatedWeekday.join('') // ['0', '1', '0', '1', '0', '0', '0'].join('') → '0101000'
            };
        });
    };


    const isFormValid = () => {
        return (
            classDetail.cdLecture !== "" &&
            classDetail.className.trim() !== "" &&
            classDetail.teacherId !== 0 &&
            classDetail.startDate !== "" &&
            classDetail.endDate !== "" &&
            classDetail.applyStartDate !== "" &&
            classDetail.applyEndDate !== "" &&
            classDetail.startTime !== "" &&
            classDetail.endTime !== "" &&
            classDetail.weekday.includes('1') &&
            classDetail.maxStudent > 0 &&
            classDetail.price > 0
        );
    };

    return (
        <Modal show={props.show} onHide={props.onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div>
                        [{classDetail.classId}] 수업정보변경
                    </div>
                </Modal.Title>
            </Modal.Header>


            <Modal.Body>

                <Row className="mb-3">
                    <Col xs="auto" className="d-flex align-items-center">
                        <div className="align-self-center">강의분류</div>
                    </Col>
                    <Col>
                        <Form.Control as="select" value={classDetail.cdLecture} 
                            onChange={e => setclassDetail({...classDetail, cdLecture: e.target.value})}>
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
                        <Form.Control type="text" value={classDetail.className} 
                        onChange={e => setclassDetail({...classDetail, className: e.target.value})} />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col xs="auto" className="d-flex align-items-center">
                        <div className="align-self-center">담당강사</div>
                    </Col>
                    <Col>
                        <Form.Control as="select" value={classDetail.teacherId} 
                            onChange={e => setclassDetail({...classDetail, teacherId: Number(e.target.value)})}>
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
                        <Form.Control type="date" value={classDetail.startDate}
                        onChange={e => setclassDetail({...classDetail, startDate: e.target.value})}/>
                        </FloatingLabel>
                    </Col>
                    <Col xs="auto" className="d-flex justify-content-center align-items-center">
                        <div><strong>~</strong></div>
                    </Col>                    
                    <Col>
                        <FloatingLabel controlId="endDate" label="교육 종료일">
                        <Form.Control type="date" value={classDetail.endDate}
                        onChange={e => setclassDetail({...classDetail, endDate: e.target.value})}/>
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">모집기간</div>
                    </Col>
                    <Col> 
                        <FloatingLabel controlId="applyStartDate" label="모집 시작일">
                        <Form.Control type="date" value={classDetail.applyStartDate}
                        onChange={e => setclassDetail({...classDetail, applyStartDate: e.target.value})}/>
                        </FloatingLabel>
                    </Col>
                    <Col xs="auto" className="d-flex justify-content-center align-items-center">
                        <div><strong>~</strong></div>
                    </Col>                    
                    <Col>
                        <FloatingLabel controlId="applyEndDate" label="모집 종료일">
                        <Form.Control type="date" value={classDetail.applyEndDate}
                        onChange={e => setclassDetail({...classDetail, applyEndDate: e.target.value})}/>
                        </FloatingLabel>
                    </Col>
                </Row>


                <Row className="mb-3">
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">수업시간</div>
                    </Col>
                    <Col> 
                        <Form.Control type="time" value={classDetail.startTime}
                            onChange={e => setclassDetail({...classDetail, startTime: e.target.value})}/>
                    </Col>
                    <Col xs="auto" className="d-flex justify-content-center align-items-center">
                        <div><strong>~</strong></div>
                    </Col>                    
                    <Col> 
                        <Form.Control type="time" value={classDetail.endTime}
                            onChange={e => setclassDetail({...classDetail, endTime: e.target.value})}/>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">요일&nbsp;&nbsp;&nbsp;</div>
                    </Col>
                    <Col>
                        {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                            <Form.Check inline type="checkbox" key={index} label={day}
                                checked={classDetail.weekday ? classDetail.weekday[index] === '1' : false}
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
                        <Form.Control type="text" value={classDetail.maxStudent}
                            onChange={e => setclassDetail({...classDetail, maxStudent: Number(e.target.value)})}/>
                    </Col>
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">수업료</div>
                    </Col>
                    <Col>
                        <Form.Control type="text" value={classDetail.price}
                            onChange={e => setclassDetail({...classDetail, price: Number(e.target.value)})}/>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">추가설명</div>
                    </Col>
                    <Col>
                        <Form.Control as="textarea" value={classDetail.description || ''}
                            onChange={e => setclassDetail({...classDetail, description:e.target.value})}/>
                    </Col>
                </Row>

            </Modal.Body>

            <Modal.Footer>
                <Button style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }} onClick={handleSave} disabled={!isFormValid()} > 저장 </Button>			
            </Modal.Footer>
        </Modal>
    );
}

export default ClassEditModal;