import { useEffect, useState } from "react";
import { Button, FloatingLabel, Modal, Form, Row, Col } from "react-bootstrap";
import api from "../../api";
import { ClassItem } from "../../types/ClassType";

function ClassStatusModal(props) {
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

    const classStatus = (classId:number)=>{
        api.get(`/class/detail?classId=${classId}`)
        .then(res=>{
            if (res.data){
                setclassDetail(res.data);
            };
        })
        .catch(error=>{
        });
    };

    useEffect(()=>{
        if (props.show) {
            classStatus(classId);
        }
      }, [props.show]);

      
    const handleSave = () => {
        api.patch('/class/status', classDetail)
        .then(res => {
            if (res.data.success) {
                alert(res.data.message);
            } else {
                alert(res.data.message);
                
            }
            props.onHide();
        })
        .catch(error => {
            alert("수정 실패했습니다.");
            props.onHide();
        });
    };      
      
    const isFormValid = () => {
        return (
            classDetail.cdStatus !== "" &&
            classDetail.startDate !== "" &&
            classDetail.endDate !== "" &&
            classDetail.applyStartDate !== "" &&
            classDetail.applyEndDate !== "" &&
            classDetail.maxStudent > 0
        );
    };
    return (
        
        <Modal show={props.show} onHide={props.onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div>
                        [{classDetail.classId}] {classDetail.className}
                        <br />
                        담당강사 : {classDetail.teacherName} 강사님
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row className="mb-3">
                    <Col xs="auto" className="d-flex">
                        <div className="align-self-center">수업상태</div>
                    </Col>
                    <Col>
                        <Form.Control as="select" 
                            value={classDetail.cdStatus} 
                            onChange={e => setclassDetail({...classDetail, cdStatus: e.target.value})}>
                                <option value="BEFORE">모집중</option>
                                <option value="READY">모집마감</option>
                                <option value="START">개강</option>
                                <option value="END">종강</option>
                                <option value="CANCEL">폐강</option>
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
                        <div className="align-self-center">모집총원</div>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="maxStudent" label="수강 총원">
                            <Form.Control type="text" value={classDetail.maxStudent}
                            onChange={e => setclassDetail({...classDetail, maxStudent: Number(e.target.value)})}/>
                        </FloatingLabel>
                    </Col>
                </Row>
            </Modal.Body>

            <Modal.Footer>
                <Button style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }} onClick={handleSave} disabled={!isFormValid()}> 수정 </Button>			
            </Modal.Footer>
        </Modal>
    );
}

export default ClassStatusModal;