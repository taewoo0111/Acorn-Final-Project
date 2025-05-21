import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import api from "../../api";
import { Button, Form, Pagination, Table } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ClassItem, ClassList, SearchState } from "../../types/ClassType";
import ClassDescModal from "../../components/admin/ClassDescModal";
import ClassStatusModal from "../../components/admin/ClassStatusModal";
import ClassAddModal from "../../components/admin/ClassAddModal";
import ClassEditModal from "../../components/admin/ClassEditModal";
import StudApplyStatModal from "@/components/admin/StudApplyStatModal";




function Class(props) {
    //로그인한 userId가져오기
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user.userId; 
    const storeName = user.storeName;

    //전체 div에 적용될 css
    const centerStyle: React.CSSProperties ={
        maxWidth:"1600px",
        margin:"0 auto",
        padding:"2rem",
        textAlign:"center"
    }

    // "/posts?pageNum=x" 에서 pageNum 을 추출하기 위한 hook
    //ex) /post?page=10&count5&keword=kim  => {pageNum:"10", count:"5", keywork:"kim"} params에는 오브젝트로 읽어준다.(숫자도 문자열로 읽어줌줌)
    const [params, setParams] = useSearchParams({
        pageNum:"1",
        condition:"",
        keyword:"",
        cdStatus:"",
        userId:""
    });

    //수업리스트+페이징정보를 상태값으로 관리
    //const [clist, setClist] = useState<ClassList | null>(null);
    const [clist, setClist] = useState<ClassList>({
        list: [],
        userId: 0,
        cdStatus: "",
        condition: "",
        keyword: "",
        startRowNum: 0,
        endRowNum: 0,
        pageNum: 0,
        totalRow: 0,
        totalPageCount: 0,
        startPageNum: 0,
        endPageNum: 0,
        findQuery: ""
    });


    //요일코드를 한글로 변환하는 함수
    const weekdayName = (weekday: string): string => {
        const days = ["월", "화", "수", "목", "금", "토", "일"];
        return weekday
            .split("") // 1010101을 하나씩 잘라서 배열로 생성  ["1", "0", "1", "0", "1", "0", "1"]
            .map((bit, index) => (bit === "1" ? days[index] : ""))
            .filter(Boolean) //Falsy 값을 제거하는 코드
            .join(", ");  // 배열을 ", " 로 join
    };


    // 해당지점 수업리스트 불러오는 함수
    const refresh  = (pageNum: number)=>{

        //상태값을 가져옴 
        const { condition, keyword, cdStatus } = searchState;
        //기본 파라미터셋팅 
        const queryParams = new URLSearchParams({
            userId: String(userId),
            pageNum: String(pageNum)
        });
        //검색조건에따라서 파라미터에 추가가
        if (cdStatus) queryParams.append("cdStatus", cdStatus);
        if (condition) {
        queryParams.append("condition", condition);
        queryParams.append("keyword", keyword);
        }
         
        //api요청
        api.get(`/class?${queryParams.toString()}`)
        .then(res=>{
            //페이징 숫자 배열을 만들어서 state 에 넣어준다.
            setPageArray(range(res.data.startPageNum, res.data.endPageNum));
            const updateClist = {
                ...res.data,
                list: res.data.list.map((item: ClassItem) => ({
                  ...item,
                  weekday: weekdayName(item.weekday) // 요일 코드 한글로 변환
                })),
              };
            setClist(updateClist);
        })
        .catch(error=>{
            console.log(error);
        });
    }


    //페이징 숫자를 출력할때 사용하는 배열을 상태값으로 관리
    const [pageArray, setPageArray]=useState<number[]>([]);

    // pageNum 변경될 때 실행
    useEffect(()=>{
        //query 파라미터 값을 읽어와 본다
        let pageNum=params.get("pageNum")
        //만일 존재 하지 않는다면 1 페이지로 설정
        if(pageNum==null)pageNum="1";
        //해당 페이지의 내용을 원격지 서버로 부터 받아온다 
        refresh(Number(pageNum))
    }, [params]);

    
    
    //페이지를 이동할 hook
    const navigate = useNavigate()

    //페이징 UI 를 만들때 사용할 배열을 리턴해주는 함수 
    function range(start:number, end:number) {
        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }

    //페이지 이동하는 함수 //navigate()함수를 이용해서 페이지를 변경하는 함수
    const move = (pageNum:number)=>{
        setSearchState({
            ...searchState,
            pageNum:pageNum,userId:userId
        });

        // object 에 저장된 정보를 이용해서 query 문자열 만들어내기 
        //searchState는 {condition:xxx, keyword:yyy}형태임
        const { condition, keyword, cdStatus } = searchState;
        const searchquery = new URLSearchParams({
            userId: String(userId),
            pageNum: String(pageNum)
        });
        //검색조건에따라서 파라미터에 추가가
        if (cdStatus) searchquery.append("cdStatus", cdStatus);
        if (condition) {
            searchquery.append("condition", condition);
        searchquery.append("keyword", keyword);
        }
        navigate(`/admin/class?${searchquery.toString()}`);
    }
    
    //검색조건 상태값으로 관리
    const [searchState, setSearchState]=useState<SearchState>({
        condition:"",
        keyword:"",
        cdStatus:"",
        pageNum:1,
        userId:userId
    });

    //검색 조건을 변경하거나 검색어를 입력하면 호출되는 함수
    const handleSearchChange = (e)=>{
        setSearchState({
            ...searchState,
            [e.target.name]:e.target.value
        });
    };

    //수업설명보기 모달창 
    const [showClassDescModal, setshowClassDescModal] = useState(false);
    
    //수업상태값변경 모달창
    const [showClassStatusModal, setshowClassStatusModal] = useState(false);
    
    //수업개설 모달창
    const [showClassAddModal, setshowClassAddModal] = useState(false);

    //수업정보수정 모달창
    const [showClassEditModal, setshowClassEditModal] = useState(false);

    //모달에 전달할 classid 상태값으로 관리
    const [selectedClassId, setSelectedClassId] = useState<number>();

    //수강생 현황 모달
    const [showApplyStatModal, setShowApplyStatModal] = useState(false);

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
        <ClassDescModal show={showClassDescModal} onHide={() => setshowClassDescModal(false)} classId={selectedClassId} />
        <ClassStatusModal show={showClassStatusModal} onHide={() => {setshowClassStatusModal(false); refresh(searchState.pageNum);}} classId={selectedClassId} />
        <ClassAddModal show={showClassAddModal} userId={userId}
                    onHide={() => 
                        {setshowClassAddModal(false); 
                            setSearchState({
                                ...searchState, condition:"", keyword:"", cdStatus:"", pageNum:1,});
                        navigate(`/admin/class?userId=${userId}&pageNum=1`); refresh(1);}}/>
        <ClassEditModal show={showClassEditModal} onHide={() => {setshowClassEditModal(false); refresh(searchState.pageNum);}} classId={selectedClassId} userId={userId} />


        <StudApplyStatModal show={showApplyStatModal} onHide={()=>{setShowApplyStatModal(false); refresh(searchState.pageNum);}} classId={selectedClassId} />

            <div className="d-flex align-items-center justify-content-center">    
                <h2 className = "fw-bold" style={{ marginTop: '60px',marginBottom: '60px' }}>  {storeName} 수업리스트  </h2>
                {/* <pre>{JSON.stringify(clist, null, 2)}</pre> */}
            </div>

            <div className="d-flex justify-content-between mb-3">
                <div className="d-flex align-items-center">
                    <Form.Label htmlFor="search" visuallyHidden>검색조건</Form.Label>
                    <Form.Select name="cdStatus" id="status" 
                        onChange={handleSearchChange}
                        value={searchState.cdStatus} className="me-2 w-auto">
                            <option value="">전체상태</option>
                            <option value="BEFORE">모집중</option>
                            <option value="START">개강</option>
                            <option value="END">종강</option>
                            <option value="CANCEL">폐강</option>
                            <option value="READY">모집마감</option>
                    </Form.Select>
                    <Form.Select name="condition" id="search" onChange={handleSearchChange} 
                        value={searchState.condition} className="me-2 w-auto">
                            <option value="">선택</option>
                            <option value="className">수업명</option>
                            <option value="teacherName">강사명</option>
                    </Form.Select>
                    <Form.Control type="text" placeholder="검색어..." name="keyword" onChange={handleSearchChange}
                        value={searchState.keyword} className="me-2 w-auto"/>
                    <Button style={{ backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }} 
                    onClick={()=>move(1)} className="me-2 w-auto">검색</Button>
                    { clist.keyword && <p className="mb-0 ms-2"> <strong>{clist.totalRow}</strong> 개의 글이 검색 되었습니다 </p>}
                </div>
            
                <div className="d-flex flex-column align-items-end">
                    <Button  style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }}
                    onClick={() => setshowClassAddModal(true)}>수업 개설</Button>
                </div>
            </div>
        
            <Table className="mx-auto text-center " style={{ tableLayout: 'fixed' }} bordered hover responsive>
                <thead className="table-secondary">
                    <tr>
                        <th style={{ width: '130px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'center', verticalAlign: 'middle' }}>[수업번호] <br />수업명</th>
                        <th style={{ width: '120px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'center', verticalAlign: 'middle' }}>강의분류</th>
                        <th style={{ width: '120px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'center', verticalAlign: 'middle' }}>담당강사</th>
                        <th style={{ width: '120px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'center', verticalAlign: 'middle' }}>수업기간</th>
                        <th style={{ width: '120px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'center', verticalAlign: 'middle' }}>시간 및<br />요일</th>
                        <th style={{ width: '120px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'center', verticalAlign: 'middle' }}>수업료</th>
                        <th style={{ width: '120px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'center', verticalAlign: 'middle' }}>설명</th>
                        <th style={{ width: '120px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'center', verticalAlign: 'middle' }}>수정</th>
                        <th style={{ width: '120px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'center', verticalAlign: 'middle' }}>모집기간</th>
                        <th style={{ width: '120px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'center', verticalAlign: 'middle' }}>모집상태</th>
                        <th style={{ width: '120px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'center', verticalAlign: 'middle' }}>수업상태</th>
                    </tr>
                </thead>
                <tbody>
                    {clist.list.map((item) =>
                        <tr key={item.classId}>
                            <td>[{item.classId}] {item.className}</td>
                            <td>{item.cdLecture}</td>
                            <td>{item.teacherName} 강사님</td>
                            <td>{item.startDate} ~ {item.endDate}</td>
                            <td>{item.startTime} ~ {item.endTime}<br />({item.weekday})</td>
                            <td>{item.price.toLocaleString()}원</td>
                            <td>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0"
                                    style={{
                                        color: '#0d6efd',
                                        fontSize: '0.9rem',
                                        textDecoration: 'none'}}
                                    onClick={()=>{
                                        setSelectedClassId(item.classId); 
                                        setshowClassDescModal(true)}}>
                                ...더보기
                                </Button>
                            </td>
                            <td>
                                <Button variant="light" size="sm"
                                    onClick={()=>{
                                        setSelectedClassId(item.classId); 
                                        setshowClassEditModal(true)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                    </svg>
                                </Button>
                            </td>
                            <td>{item.applyStartDate} ~ {item.applyEndDate}</td>
                            <td>
                                <Button variant="outline-secondary"  
                                onClick={()=>{
                                        setSelectedClassId(item.classId); 
                                        setShowApplyStatModal(true)}
                                }>{item.currentStudent}/{item.maxStudent}</Button>
                            </td>
                            <td><Button variant="outline-secondary" 
                                disabled={item.cdStatus === '종강' || item.cdStatus === '폐강'}
                                onClick={()=>{
                                    setSelectedClassId(item.classId); 
                                    setshowClassStatusModal(true)}}
                            >{item.cdStatus}</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Pagination className='mt-3 justify-content-center'>
                <Pagination.Item onClick={()=>move(clist.startPageNum-1)} 
                    disabled={clist.startPageNum === 1}>Prev</Pagination.Item>
                {
                    pageArray.map(item => 
                        <Pagination.Item onClick={()=>move(item)} key={item}
                            active={clist.pageNum === item}>{item}</Pagination.Item>
                    )
                }
                <Pagination.Item onClick={()=>move(clist.endPageNum+1)}
                    disabled={clist.endPageNum === clist.totalPageCount}>Next</Pagination.Item>
            </Pagination> 
            

        </div>
    );
}

export default Class;