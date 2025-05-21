
export interface ClassItem {
    classId: number;
    className: string;
    cdLecture: string;
    userId: number;
    teacherId: number;
    teacherName: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    weekday: string;
    currentStudent: number;
    maxStudent: number;
    price: number;
    applyStartDate: string;
    applyEndDate: string;
    cdStatus: string;
    description: string;
}

export interface ClassList {
    list: ClassItem[];
    userId: number;
    cdStatus: string;
    condition: string;
    keyword: string;
    startRowNum: number;
    endRowNum: number;
    pageNum: number;
    totalRow: number;
    totalPageCount: number;
    startPageNum: number;
    endPageNum: number;
    findQuery: string;
}

export interface SearchState {
    condition: string;
    keyword: string;
    cdStatus: string;
    pageNum:number;
    userId:number;
}    

export interface cdLecture {
    acode: string;
    bcode: string;
    bname: string;
    deleted:string;
}    

export interface teacherlist {
    teacherId :number;
    name: string;
    userId:number;
    cdStatus: string;
}    

