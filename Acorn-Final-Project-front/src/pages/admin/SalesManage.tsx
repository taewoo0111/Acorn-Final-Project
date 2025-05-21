import React, { MouseEvent, useEffect, useState } from 'react';
import AdminSalesModal from '../../components/admin/AdminSalesModal';
import { Button, Form, Pagination, Table } from 'react-bootstrap';
import axios from 'axios';
import { BrowserRouter, useSearchParams } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Layout from '../../Layout';
import api from '../../api';
import { AdminSalesDto } from '../../types/AdminSalesDto';

interface PageInfo {
    list: AdminSalesDto[];
    pageNum: number;
    startPageNum: number;
    endPageNum: number;
    totalPageCount: number;
    totalRow: number;
  }
function SalesManage() {
    const [storeName, setStoreName] = useState<string>('');
    const [userId, setUserId]=useState<string>('');
    const [modalShow, setModalShow] = useState(false);
    const [title, setTitle] = useState("매출 추가");
    const [btnTag, setBtnTag] = useState("추가")
    const [onBtn, setOnBtn] = useState(()=>{ })
    //매출 수정/삭제 시 saleId읽어오기 위해 관리되는 값
    const [selectedItem, setSelectedItem]=useState<AdminSalesDto|null>(null)
    //검색조건 체크박스 관리값
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [params, setParams] = useSearchParams({
        checkedItems:checkedItems,
        userId:"",
        pageNum:"1"
    })
    useEffect(()=>{
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        setStoreName(user.storeName);
        console.log('localStorage user:', user);
        setUserId(user.userId)
   
        handleSearch();
    },[params.toString()])
    useEffect(()=>{
        params.set("userId", userId)
    },[userId])
    
    const move = (page: number) => {
        const newParams = new URLSearchParams(params);
        newParams.set("pageNum", page.toString());
        setParams(newParams);
    };  
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setCheckedItems(prev =>
            checked ? [...prev, value] : prev.filter(item => item !== value)
        );
    };
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        list: [],
        pageNum: 1,
        startPageNum: 1,
        endPageNum: 1,
        totalPageCount: 1,
        totalRow: 0
      });
    
    function listToQuery(list, paramName){
        let query="";
        for(let i=0; i<list.length; i++){
            if(i==list.length-1){
                query += `${paramName}=${list[i]}`;
            }else{
                query += `${paramName}=${list[i]}&`;
            }
        }
        return query;
    }
    function range(start:number, end:number):number[] {
        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }
    const [pageArray, setPageArray]=useState<number[]>([]);
    const handleSearch=()=>{
        const query=listToQuery(checkedItems, "checkedItems");
        api.get(`/sales?${query}`,{
            params:{
                userId:userId,
                pageNum:params.get("pageNum")
            }
        })
        .then(res=>{
            console.log(res.data);
            setPageInfo(res.data);
            setPageArray(range(res.data.startPageNum, res.data.endPageNum))
        })
        .catch(error=>console.error("리스트를 불러오는데 오류가 생겼습니다"));
    }
    const handleAdd = () => {
        setSelectedItem(null); // 초기화
        setTitle("매출 추가")
        setBtnTag("추가")
        setOnBtn(()=>handleAddSales)
        setModalShow(true)
        
    };
    const handleAddSales = (data:{
        selectedAname: string;
        selectedBname: string;
        saleName:string;
        price:number;
        userId:string;
    })=>{
        const requestBody = {
            aname:data.selectedAname,
            bname: data.selectedBname,
            saleName:data.saleName,
            price:data.price,
            userId:data.userId
        }
        api.post("/sales", requestBody)
        .then(res=>{
            alert("매출이 추가되었습니다")
            setModalShow(false)
            handleSearch(); // 추가 후 리스트 갱신
        })
        .catch(error=>{
            console.error("매출 추가 실패:", error)
            alert("매출을 추가할 수 없습니다.")
        })      
    }
    const handleUpdate = (id:number) => {   
        const item = pageInfo.list.find(item => item.adminSaleId === id);
        if (!item){ 
            return;
        }
        setTitle("매출 수정");
        setBtnTag("수정");
        setOnBtn(() => (data) => handleUpdateSales(data, item.adminSaleId)); 
        setSelectedItem(item); // 모달에 넘길 초기값
        setModalShow(true);
    }; 
    const handleUpdateSales=(
        data: {
            selectedAname: string;
            selectedBname: string;
            saleName: string;
            price: number;
            adminSaleId: number;
            userId: number;
        },
        itemId?:number
    ) => {
        const adminSaleId = itemId ?? data.adminSaleId;
        if (!adminSaleId) return;
    
        const requestBody = {
            aname: data.selectedAname,
            bname: data.selectedBname,
            saleName: data.saleName,
            price: data.price,
            adminSaleId: adminSaleId,
            userId: data.userId
        };
        api.put(`/sales/${adminSaleId}`, requestBody)
        .then(res=>{
            alert("매출이 수정되었습니다");
            setModalShow(false);
            handleSearch(); // 수정 후 리스트 갱신
        })
        .catch(error=>{
            console.error("매출 수정 실패:", error);
            alert("매출 수정에 실패했습니다.");
        })             
    };
    const handleDelete=(id:number)=>{
        const item = pageInfo.list.find(item => item.adminSaleId === id);
        if (!item) return;
        const adminSaleId=item.adminSaleId
        // confirm 창에서 '예'를 눌렀을 때만 삭제 요청 실행
        const isConfirmed = confirm("정말 삭제하시겠습니까?");
        if (!isConfirmed) return;  // '아니오'를 눌렀으면 종료
        api.delete(`/sales/${adminSaleId}`)
        .then(res=>{
            handleSearch();
        })
        .catch(error=>{
            alert("매출 삭제에 실패했습니다")
        })
    }
    //전체 div에 적용될 css
    const centerStyle: React.CSSProperties ={
        maxWidth:"1600px",
        margin:"0 auto",
        padding:"2rem",
        textAlign:"center"
    }
    
    return (
        <div>
            <AdminSalesModal show={modalShow} title={title} btnTag={btnTag} onBtn={onBtn} 
                                onClose={()=>setModalShow(false)} initialData={selectedItem} userid={userId}/>
        
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
                    <h2 className = "fw-bold" style={{ marginTop: '60px',marginBottom: '60px' }}>{storeName} 매출 리스트</h2>
                </div>
                <div className="d-flex justify-content-between mb-3">
                    <div className="col-md-8 col-12 d-flex justify-content-between align-items-center">
                        <Form className='d-flex w-100 align-items-center'>
                            <Form.Check inline label="수업수입" value="CLS" type="checkbox" id="CLS"onChange={handleCheckboxChange}/>
                            <Form.Check inline label="나머지수입" value="ETC" type="checkbox" id="ETC" onChange={handleCheckboxChange}/>
                            <Form.Check inline label="급여" value="SALARY" type="checkbox" id="SALARY" onChange={handleCheckboxChange}/>
                            <Form.Check inline label="발주" value="ITEM" type="checkbox" id="ITEM" onChange={handleCheckboxChange}/>
                            <Form.Check inline label="지출기타" value="C_ETC" type="checkbox" id="C_ETC" onChange={handleCheckboxChange}/>
                            <Button style={{ backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)'  }}
                              onClick={()=>{handleSearch(); move(1)}}>검색</Button>
                        </Form>
                    </div>
                    <div className='col-md-4 col-12 d-flex justify-content-end mt-3 mt-md-0'>
                        <Button className="btn me-2"  onClick={handleAdd}  style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }}>매출 추가</Button>
                    </div>
                </div>
                <div>
                    <Table className="mx-auto text-center " style={{ tableLayout: 'fixed' }} bordered hover responsive>
                        <thead className="table-secondary">
                            <tr>
                                <th>매출등록일자</th>
                                <th>매출수정일자</th>
                                <th>항목 내용</th>
                                <th>금액</th>
                                <th>대분류</th>
                                <th>소분류</th>
                                <th>수정</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageInfo.list.map((item)=>(
                                <tr className="table-hover" key={item.adminSaleId}>
                                    <td>{item.creDate}</td>
                                    <td>{item.editDate}</td>
                                    <td>{item.saleName}</td>
                                    <td>{item.price.toLocaleString()}</td>
                                    <td>{item.aname}</td>
                                    <td>{item.bname}</td>
                                    <td>
                                        <button onClick={()=>handleUpdate(item.adminSaleId)} className="btn btn-sm btn-light">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                            </svg>
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={()=>handleDelete(item.adminSaleId)} className="btn btn-sm btn-outline-danger" style={{ border: 'none' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                                 
                            }                           
                        </tbody>
                    </Table>
                    <Pagination className='mt-3 justify-content-center'  >
                        <Pagination.Item onClick={()=>move(pageInfo.startPageNum-1)} 
                            disabled={pageInfo.startPageNum === 1}>Prev</Pagination.Item>
                        {
                            pageArray.map(item => 
                                <Pagination.Item onClick={()=>move(item)} key={item}
                                    active={pageInfo.pageNum === item}>{item}</Pagination.Item>
                            )
                        }
                        <Pagination.Item onClick={()=>move(pageInfo.endPageNum+1)}
                            disabled={pageInfo.endPageNum === pageInfo.totalPageCount}>Next</Pagination.Item>
                    </Pagination> 
                </div>
            </div>
        </div>
    );
}

export default SalesManage