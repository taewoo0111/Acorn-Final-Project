import { useEffect, useState } from 'react';
import { Button, Form, Pagination, Table } from 'react-bootstrap';
import RegisterModal from '../../components/admin/tRegisterModal';
import UpdateModal from '../../components/admin/tUpdateModal';
import HistoryModal from '../../components/admin/tHistoryModal';
import api from '../../api';
import { useSearchParams } from 'react-router-dom';

// 강사 정보 관리를 위한 강사 타입 
interface Teacher{
    teacherId: number;
	name: string;
    birth: string;
    phone: string;
	userId: number;
    storeName: string;
    salary: number;
    cdStatus: string;
    statusName: string;
    classNames: string; 
}

// 해당 페이지의 모든 정보 관리를 위한 pageInfo 타입
interface PageInfo {
    list: Teacher[];
    startPageNum: number;
    endPageNum: number;
    totalPageCount: number;
    pageNum: number;
    totalRow: number;
    state: string;
    condition: string;
    keyword: string;
}

function TeacherList() {
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        list: [],
        startPageNum: 0,
        endPageNum: 0,
        totalPageCount: 0,
        pageNum: 1,
        totalRow: 0,
        state: "WORK",
        condition: "",
        keyword: ""
    });

    // const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [showRegister, setShowRegister] = useState(false);
    const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    const [params, setParams] = useSearchParams(); // URL 기준으로 상태 유지 및 변경
    const [pageArray, setPageArray] = useState<number[]>([]);
    
    // const userId = "2"; // userId 데이터 가져오기
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user.userId; 
    const storeName = user.storeName;

    const state = params.get("state") || "WORK";
    const condition = params.get("condition") || "";
    const keyword = params.get("keyword") || "";
    const pageNum = parseInt(params.get("pageNum") || "1");

    const [searchCondition, setSearchCondition] = useState(condition);
    const [searchKeyword, setSearchKeyword] = useState(keyword);    

   // 페이징용 숫자 배열 생성
    function range(start: number, end: number): number[] {
        const result: number[] = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }

    // 학생 목록 데이터 가져오기
    const fetchData = () => {
        console.log({ userId, pageNum, state, condition, keyword });
        api.get('/teachers', {
            params: {
                userId,
                pageNum,
                state,
                condition,
                keyword,
            }
        })
        .then(res => {
            console.log(res.data);
            setPageInfo(res.data);
            setPageArray(range(res.data.startPageNum, res.data.endPageNum));
        })
        .catch(err => console.error(err));
    };

    // 페이지 이동
    const move = (newPageNum: number) => {
        setParams({
          userId,
          pageNum: newPageNum,
          state,
          condition,
          keyword,
        });
    };

      // state 변경 시 1페이지로 이동
      const changeState = (newState: string) => {
        setParams({
          userId,
          pageNum: "1",
          state: newState,
          condition,
          keyword,
        });
      };

    // 검색 버튼 클릭 시 condition, keyword 반영
    const handleSearch = (): void => {
        console.log({ userId, pageNum, state, condition, keyword });
        setParams({
          userId,
          pageNum: "1",
          state,
          condition: searchCondition,
          keyword: searchKeyword,
        });
    };

    useEffect(() => {
        fetchData();
    }, [params]); // params 변화에 따라 fetchData

    //전체 div에 적용될 css
    const centerStyle: React.CSSProperties ={
        maxWidth:"1600px",
        margin:"0 auto",
        padding:"2rem",
        textAlign:"center"
    }
	
    
    return (
        <div style={centerStyle}>
    <style>
      {`
        .pagination .page-link {
          color:rgb(100, 131, 223);
        }

        .pagination .page-item.active .page-link {
          background-color: rgb(71, 95, 168);
          color: white;
        }
      `}
    </style>            
            <div className="d-flex align-items-center justify-content-center">
                <h2 className = "fw-bold" style={{ marginTop: '60px',marginBottom: '60px' }}>{storeName} 강사 리스트</h2>
            </div>

            <div className="d-flex justify-content-between mb-3">
                <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center gap-2">                
                        {/* 상태 */}
                        <Form.Select value={state} onChange={(e) => changeState(e.target.value)} style={{ maxWidth: "100px" }}>
                            <option value="WHOLE">전체</option>
                            <option value="WORK">재직</option>
                            <option value="T_QUIT">퇴직</option>
                        </Form.Select>

                        {/* 검색 조건 drop-down 선택 */}                
                        <Form.Select value={searchCondition} onChange={(e) => setSearchCondition(e.target.value)} style={{ minWidth: "100px" }}>
                            <option value="">선택</option>
                            <option value="TEACHER">강사명</option>
                            <option value="CLASS">수업명</option>
                        </Form.Select>                    

                        {/* 검색어 keyword 입력 */}
                        <Form.Control
                            type="text"
                            placeholder={
                                searchCondition === "TEACHER" 
                                ? "강사명을 입력하세요" 
                                : searchCondition === "CLASS"
                                ? "수업명을 입력하세요"
                                : "검색조건을 선택하세요"
                            }
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={{ minWidth: "200px" }}
                        />

                        {/* 검색 버튼 */}
                        <Button style={{ backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)', whiteSpace: "nowrap" }}
                         onClick={handleSearch} >검색</Button>
                    </div>

                    { pageInfo.keyword && (
                        <p className="mb-0 ms-2"><strong>{pageInfo.totalRow}</strong> 명의 강사가 검색되었습니다</p>
                    )}
                </div>
            
                <div className="d-flex flex-column align-items-end">
                    <Button  style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }}
                    className="ms-auto" onClick={() => setShowRegister(true)}>강사 등록</Button>
                </div>

            </div>

            <Table className="mx-auto text-center" bordered hover responsive>
                <thead className="table-secondary">
                    <tr>
                        <th>강사번호</th>
                        <th>지점명</th>
                        <th>강사명</th>
                        <th>생년월일</th>
                        <th>연락처</th>
                        <th>재직 여부</th>                         
                        <th>현재 담당 수업</th>
                        <th>수업 이력</th>
                        <th>정보 수정</th>
                    </tr>
                </thead>
                <tbody>
                    { pageInfo.list.map((teacher) => (
                        <tr key={teacher.teacherId}>
                            <td>{teacher.teacherId}</td>
                            <td>{teacher.storeName}</td>
                            <td>{teacher.name}</td>
                            <td>{teacher.birth}</td>
                            <td>{teacher.phone}</td>
                            <td>{teacher.statusName}</td>
                            <td>{teacher.cdStatus === "WORK" ? teacher.classNames : "-"}</td>
                            <td>
                                <Button variant="light" className="btn btn-sm" size="sm" onClick={() => setSelectedTeacher(teacher)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-journal-text" viewBox="0 0 16 16">
                                        <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                                        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
                                        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
                                    </svg>
                                </Button>
                            </td>
                            <td>
                                <Button variant="light" className="btn btn-sm" size="sm" onClick={() => setEditTeacher(teacher)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination className="mt-3 justify-content-center">
                <Pagination.Item onClick={() => move(pageInfo.startPageNum - 1)}
                    disabled={pageInfo.startPageNum === 1}>
                    Prev
                </Pagination.Item>
                {pageArray.map(item => (
                    <Pagination.Item
                        key={item}
                        onClick={() => move(item)}
                        active={pageInfo.pageNum === item}
                    >
                        {item}
                    </Pagination.Item>
                ))}
                <Pagination.Item onClick={() => move(pageInfo.endPageNum + 1)}
                    disabled={pageInfo.endPageNum === pageInfo.totalPageCount}>
                    Next
                </Pagination.Item>
            </Pagination>

            {showRegister && (
                <RegisterModal
                    show={true}
                    onClose={() => setShowRegister(false)}
                    onRegister={fetchData}
                />
            )}

            {editTeacher && (
                <UpdateModal
                    teacher={editTeacher}
                    show={true}
                    onClose={() => setEditTeacher(null)}
                    onUpdate={fetchData}
                />
            )}

            {selectedTeacher && (
                <HistoryModal
                    teacher={selectedTeacher}
                    show={true}
                    onClose={() => setSelectedTeacher(null)}
                />
            )}
        </div>
    );
}

export default TeacherList;