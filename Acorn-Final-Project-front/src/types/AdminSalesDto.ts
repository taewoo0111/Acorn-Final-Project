export interface AdminSalesDto {
    adminSaleId: number;
    userId:string;
    storeName: string;
    saleName: string;
    creDate: string;
    editDate: string;
    price: number;
    cdAcode: string;
    cdBcode: string;
    checkedItems: string[];
    auto: string;
    startRowNum: number;
    endRowNum: number;
    pageNum: number;
    list: AdminSalesDto[]; // 재귀 구조
    startPageNum: number;
    endPageNum: number;
    totalPageCount: number;
    totalRow: number;
    aname:string;
    bname:string;
  }