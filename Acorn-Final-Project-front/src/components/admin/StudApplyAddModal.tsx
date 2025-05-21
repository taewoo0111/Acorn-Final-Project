import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import api from '@/api';
import './LockIcon.css';

type SelectableStudent = {
  studentId: number;
  name: string;
  phone: string;
  selectable: boolean; // 수강 가능 여부
  conflictReason?: string; // 중복 이유(optional)
};

type StudApplyAddModalProps = {
  show: boolean;
  onHide: () => void;
  onAddStudents: (selected: SelectableStudent[]) => void;
  alreadyAddedIds: number[]; // 이미 수강 신청된 학생 ID
  currentCount: number; // 현재 수강 인원
  maxCount: number; // 최대 정원
  classId: number; // 수업 ID
  userId: number;
};

function StudApplyAddModal({ show, onHide, onAddStudents, alreadyAddedIds, currentCount, maxCount, classId, userId }: StudApplyAddModalProps) {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filteredResults, setFilteredResults] = useState<SelectableStudent[]>([]);
    // const [searchResults, setSearchResults] = useState([]);
    const [selectableStudents, setSelectableStudents] = useState<SelectableStudent[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<SelectableStudent[]>([]);

  // 수강 가능 학생 조회
  useEffect(() => {
    if (show) {
      api.get(`/class/check-students`, {
        params: {
          classId,
          userId,
        },
      })
        .then(res => {
            console.log(res.data);
            setSelectableStudents(res.data);
        })
        .catch(err => console.log('학생 조회 실패:', err));
    }
  }, [show, classId, userId]);

  // 검색 필터 적용한 학생 조회
  useEffect(() => {
    const keyword = searchKeyword.toLowerCase();
    const results = selectableStudents.filter(s =>
        s.name.toLowerCase().includes(keyword) &&
        !alreadyAddedIds.includes(s.studentId)
    );
    setFilteredResults(results);
  }, [searchKeyword, selectableStudents, alreadyAddedIds]);

  const toggleStudent = (student: SelectableStudent) => {
    if (!student.selectable) return;

    const alreadySelected = selectedStudents.find(s => s.studentId === student.studentId);
    if (alreadySelected) {
      setSelectedStudents((prev) => prev.filter(s => s.studentId !== student.studentId));
    } else {
      const totalCount = currentCount + selectedStudents.length + 1;
      if (totalCount > maxCount) {
        alert('최대 수강 인원을 초과할 수 없습니다.');
        return;
      }
      setSelectedStudents(prev => [...prev, student]);
    }
  };

  const isSelected = (studentId: number): boolean =>
    selectedStudents.some((s) => s.studentId === studentId);

  const handleConfirm = () => {
    if (selectedStudents.length === 0) return;

      api.post(`/class/${classId}/students`, selectedStudents.map(s => s.studentId)) // [1,2,3] 배열만 전달
      .then(res => {
        onAddStudents(selectedStudents); // UI 업데이트
        setSelectedStudents([]);
        setSearchKeyword('');
        console.log(res.data);
        alert('수강생을 추가했습니다'); // confirm 창
        onHide(); 
      })
      .catch(error => {
        console.log('수강생 추가 실패:', error);
        alert('수강생 추가에 실패했습니다.');
      });
  };
    
  const handleClose = () => {
    setSelectedStudents([]);
    setSearchKeyword('');
    onHide();
  };

    // 예외 강제로 허용하는 경우
    // 자물쇠 아이콘 클릭 시 활성화/비활성화 처리
    const toggleForceEnable = (index: number) => {
      setFilteredResults((prev) => {
        const updated = [...prev];
        const student = updated[index];
    
        // 토글 로직: 현재 상태가 비활성화되어 있으면 활성화, 활성화되어 있으면 비활성화
        updated[index] = {
          ...student,
          selectable: !student.selectable,  // 토글
          conflictReason: student.selectable ? student.conflictReason : '', // 활성화 시, conflictReason 숨기기
        };
        return updated;
      });
    };

    // SVG 자물쇠 아이콘 
    function LockIcon({ locked, onClick }: { locked: boolean; onClick: () => void }) {
      return (
        <div className={`lock-container ${locked ? 'locked' : 'unlocked'}`} onClick={onClick}>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke={locked ? '#6c757d' : '#198754'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lock-icon-svg"
          >
            <rect x="3" y="10" width="18" height="12" rx="2" ry="2" />
            <path d={locked ? "M7 10V6a5 5 0 0 1 10 0v4" : "M7 10V6a5 5 0 0 1 10 0"} />
          </svg>
        </div>
      );
    }
    
    return (
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>수강생 추가</Modal.Title>
        </Modal.Header>
  
        <Modal.Body>
            <Form.Control
                type="text"
                placeholder="학생 이름 검색..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="mb-3"/>
            <div>
              <h6>학생 조회</h6>
              <div style={{ maxHeight: 350, minHeight: 350, overflowY: 'auto' }}>
              <Table size="sm" className="mx-auto text-center" bordered hover responsive> 
                  <thead>
                    <tr>
                        <th>선택</th>
                        <th>학생번호</th>
                        <th>학생명</th>
                        <th>연락처</th>
                        <th>비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((student, index) => (
                        <tr key={student.studentId}>
                        <td>
                        <Form.Check
                          type="checkbox"
                          disabled={!student.selectable}
                          checked={isSelected(student.studentId)}
                          onChange={() => toggleStudent(student)}
                            />
                        </td>
                        <td>{student.studentId}</td>
                        <td>{student.name}</td>
                        <td>{student.phone}</td>
                        <td className="text-center">
                          {!student.selectable ? (
                             <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>{student.conflictReason}</Tooltip>}
                               >
                                <span>
                                  <LockIcon
                                    locked={!student.selectable}
                                    onClick={() => toggleForceEnable(index)}
                                  />
                                </span>
                              </OverlayTrigger>
                            ) : (
                              <LockIcon
                                locked={!student.selectable}
                                onClick={() => toggleForceEnable(index)}
                              />
                            )}
                        </td>
                        </tr>
                    ))}
                  </tbody>
              </Table>
              </div>
            </div>
           
            <div>
              <h6 className="mt-4">추가 대상 (현재 수업 <strong>{maxCount-(currentCount+selectedStudents.length)}</strong> 명 추가 가능)</h6>
              <div style={{  maxHeight: 250, minHeight: 200, overflowY: 'auto' }}>
              <Table size="sm" className="mx-auto text-center" bordered hover responsive>
                <thead className="table-secondary">
                    <tr>
                        <th>학생명</th>
                        <th>연락처</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedStudents.map((s) => (
                    <tr key={s.studentId}>
                        <td>{s.name}</td>
                        <td>{s.phone}</td>
                        <td>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() =>
                            setSelectedStudents((prev) => prev.filter((student) => student.studentId !== s.studentId))
                            }
                        >
                            삭제
                        </Button>
                        </td>
                    </tr>
                    ))}
                </tbody>
              </Table>
              </div>
            </div>  
        </Modal.Body>
  
        <Modal.Footer>
          <Button
            style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }}
            onClick={handleConfirm}
            disabled={selectedStudents.length === 0}
          >
            추가
          </Button>
        </Modal.Footer>
      </Modal>
    );
}

export default StudApplyAddModal;