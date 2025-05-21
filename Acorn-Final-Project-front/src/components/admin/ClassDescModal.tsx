import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import api from "../../api";
import { ClassItem } from "../../types/ClassType";
import { ResizableBox } from "react-resizable";

function ClassDescModal(props) {

    const classId = props.classId //클래스 id가져오는거!

    const [classdesc, setclassdesc] = useState<ClassItem>({
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

    const classDescription = (classId:number)=>{
        api.get(`/class/description?classId=${classId}`)
        .then(res=>{
            console.log(res.data); 
            if (res.data){
                setclassdesc(res.data);
            };
        })
        .catch(error=>{
        });
    };

    useEffect(()=>{
        if (props.show) {
            classDescription(classId);
        }
        
      }, [props.show]);

    return (

        <Modal show={props.show} onHide={props.onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>[{classdesc.classId}] {classdesc.className}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dee2e6',
                borderRadius: '0.5rem',
                padding: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                whiteSpace: 'pre-line',
                width: '100%', // 고정된 가로 크기
                minHeight: '500px',   // 기본 높이
                maxHeight: '600px',   // 너무 길면 스크롤
                overflowY: 'auto',
                margin: '0 auto',  // 가운데 정렬
            }}
            >
                {classdesc.description || '등록된 설명이 없습니다...'}</div>
            </Modal.Body>
        </Modal>
        
    );
}

export default ClassDescModal;