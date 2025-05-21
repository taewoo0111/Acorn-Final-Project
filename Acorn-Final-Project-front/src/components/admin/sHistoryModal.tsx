import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import api from '../../api';

interface ClassHistory {
    studentId: number;
    name: string;
    classId: number;
    className: string;
    teacherId: number;
    teacherName: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    weekday: string;
}

interface HistoryModalProps {
    student: { studentId: number; name: string };
    show: boolean;
    onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ student, show, onClose }) => {
    const [histories, setHistories] = useState<ClassHistory[]>([]);
    const studentId = student.studentId;
    // const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        api.get(`/students/class?studentId=${studentId}`)
        .then(res => {
            console.log(res.data);
            const data = Array.isArray(res.data) ? res.data : [];
            // classId 또는 필수 필드가 없는 경우 필터링 (빈 배열 추가되지 않도록)
            const filtered = data.filter(item =>
                item &&
                typeof item.classId === "number" &&
                item.className &&
                item.teacherName
            );
            setHistories(filtered);
        })
        .catch(err => console.log(err));
    }, [studentId]);

    //요일코드를 한글로 변환하는 함수
    const weekdayName = (weekday: string | null | undefined): string => {
        if (!weekday) return ""; // if(histories.length === 0)
        
        const days = ["월", "화", "수", "목", "금", "토", "일"];
        return weekday
            .split("") // 1010101을 하나씩 잘라서 배열로 생성  ["1", "0", "1", "0", "1", "0", "1"]
            .map((bit, index) => (bit === "1" ? days[index] : ""))
            .filter(Boolean) // False 값을 제거하는 코드
            .join(", ");  // 배열을 ", " 로 join
        };
      
    
    return (
        <Modal show={show} onHide={onClose} size="xl" centered>    
            <Modal.Header closeButton>
                <Modal.Title><strong>{student.name}</strong> 학생 수강 이력</Modal.Title>
            </Modal.Header>
            {/* Modal Body 의 높이 고정 + 스크롤 적용 */}
            <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {histories.length === 0 ? (
                    <div className="text-center py-4">해당되는 수업이 없습니다.</div>
                ):(                                   
                    <Table bordered hover className="mx-auto text-center">
                        <thead className="table-secondary">
                            <tr>
                                <th>번호</th>
                                <th>수업명</th>
                                <th>강사명</th>
                                <th>수강기간</th>
                                <th>수강시간</th>
                            </tr>
                        </thead>
                        <tbody>
                            {histories.map((history, index) => (
                                <tr key={history.classId}>
                                    <td>{index + 1}</td>
                                    <td>[{history.classId}] {history.className}</td>
                                    <td>{history.teacherName}</td>
                                    <td>{history.startDate} ~ {history.endDate}</td>
                                    <td>[{weekdayName(history.weekday)}] {history.startTime} ~ {history.endTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
            
        </Modal>
    );
};

export default HistoryModal;
