import React, { useEffect, useState } from 'react';
import { Button, CloseButton, Modal, Table } from 'react-bootstrap';
import StudApplyAddModal from './StudApplyAddModal';
import { ClassItem } from '@/types/ClassType';
import api from '@/api';

type SelectableStudent = {
  studentId: number;
  name: string;
  phone: string;
  selectable: boolean; // 수강 가능 여부
  conflictReason?: string; // 중복 이유(optional)
};

// Props 인터페이스 정의
interface StudApplyStatModalProps {
  show: boolean;
  onHide: () => void;
  classId: number;
}

function StudApplyStatModal({ show, onHide, classId }: StudApplyStatModalProps) {

    //해당 수업정보 상태값으로 관리
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

    const [students, setStudents] = useState<SelectableStudent[]>([]);
    // const [allStudents, setAllStudents] = useState<StuItem[]>([]);

    //수업정보 불러오기
    const classinfo = (classId: number) => {
        api.get(`/class/detail?classId=${classId}`)
        .then(res => {
            console.log('클래스정보!!:', res.data);
            setclassDetail(res.data);
        })
        .catch(error => console.log(error));
    };
/*
    //모든 학생 리스트 불러오기
    const stuall = (userId: number) => {
        api.get(`class/all-student?userId=${classDetail.userId}`)
        .then(res => {
            setAllStudents(res.data);
        })
        .catch(error => console.log(error));
    };
*/
    //해당 수업 듣는 학생 리스트 불러오기
    const stuclass = (classId:number) => {
        api.get(`class/student?classId=${classId}`)
        .then(res => {
            setStudents(res.data);
        })
        .catch(error => console.log(error));
    };

    useEffect(()=>{
        if (show) {
            classinfo(classId);
            stuclass(classId);
            // stuall(classDetail.userId);
        }
    }, [show]);

    // 학생 추가(StudApplyAddModal 에서 필요)
    const handleAddStudents = (newStudents: SelectableStudent[]): void => {
        const newIds = new Set(students.map(s => s.studentId));
        const filtered = newStudents.filter(s => !newIds.has(s.studentId));
        setStudents(prev => [...prev, ...filtered]);

    };

    // 학생 수강 수업 DB 에서 삭제
    const handleRemoveStudent = (studentId: number) => {
        if (!window.confirm("수강생을 삭제하시겠습니까?")) return;
    
        api.delete(`/class/${classId}/student/${studentId}`)
        .then(() => {
            setStudents(prev => prev.filter(s => s.studentId !== studentId)); // 해당 학생 수강생 리스트에서 필터링
            alert("수강생을 삭제했습니다")
        })
        .catch(error => {
            console.error('수강 취소 실패:', error);
            alert('수강 취소에 실패했습니다.');
        });
    };

    //수강생 추가 모달
    const [showApplyAddModal, setShowApplyAddModal] = useState(false);

    return (
        <>

        <Modal show={show} onHide={onHide} size="xl" centered>
                <Modal.Header>
                    <Modal.Title><strong>[{classDetail.classId}] {classDetail.className} </strong> 수강생 리스트</Modal.Title>
                    <CloseButton onClick={onHide} />
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="d-flex justify-content-between mb-3 w-100" style={{ maxWidth: 600 }}>
                        <h5>수업 신청현황 : {students.length}/{classDetail.maxStudent}</h5>
                        <Button style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }} onClick={() => setShowApplyAddModal(true)}>수강생 추가</Button>
                    </div>
                    <div style={{ maxHeight: 400, width: '100%', maxWidth: 800, overflowY: 'auto' }}>
                        <Table bordered size="sm" className="text-center align-middle">
                            <thead className="table-secondary">
                                <tr>
                                    <th>학생번호</th>
                                    <th>학생명</th>
                                    <th>연락처</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.studentId}>
                                        <td>{student.studentId}</td>
                                        <td>{student.name}</td>
                                        <td>{student.phone}</td>
                                        <td>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleRemoveStudent(student.studentId)}                      
                                            >
                                                수강 취소
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            <StudApplyAddModal
                show={showApplyAddModal}
                onHide={() => setShowApplyAddModal(false)}
                onAddStudents={handleAddStudents}
                alreadyAddedIds={students.map(s => s.studentId)}            
                currentCount={students.length}
                maxCount={classDetail.maxStudent}
                classId={classDetail.classId}
                userId={classDetail.userId} 
            />

        </>
 
    );
}

export default StudApplyStatModal;