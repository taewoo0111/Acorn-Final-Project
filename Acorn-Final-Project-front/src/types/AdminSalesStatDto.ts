export interface AdminSalesStatDto {
    userId: number | null;
    smonth: string | null;
    syear: string | null;
    price: number;
    total: number;                   // 총 매출
    studentCount: number;           // 수강생 수
    cdLecture: string | null;       // 과목 코드
    lectureName:string|null;

    smonthList?: AdminSalesStatDto[]; // 월별 데이터 리스트
    syearList?: AdminSalesStatDto[];  // 연도별 데이터 리스트
    profitList?: AdminSalesStatDto[]; // 수익
    costList?: AdminSalesStatDto[];   // 지출
    
    lectSaleYearly?: AdminSalesStatDto[];   // 과목별 연매출 리스트
    lectSaleMonthly?: AdminSalesStatDto[];  // 과목별 월매출 리스트
  
    search?: AdminSalesStatDto | null;    // 검색 필터



  }
  