import { useQuery } from '@tanstack/react-query';

export interface OverviewData {
  students: number;
  users: number;
  ceoSale: number;
}

export interface MonthlySales {
  month: string;
  sales: number;
}

// API 응답 타입 정의
interface PopularLectureResponse {
  CD_LECTURE: string;
  LECTURE_COUNT: number;
}

export interface PopularLecture {
  cdLecture: string;    // 강의 코드
  lectureCount: number; // 수강생 수
}

export interface OverviewItem {
  title: string;
  value: string;
  color: string;
}

export const useCeoStatistics = () => {
  // Overview 데이터
  const overviewQuery = useQuery({
    queryKey: ['statistics', 'overview'],
    queryFn: async () => {
      const [students, users, ceoSale] = await Promise.all([
        fetch('api/ceo/overview/students').then(res => res.json()),
        fetch('api/ceo/overview/users').then(res => res.json()),
        fetch('api/ceo/overview/ceosale').then(res => res.json())
      ]);

      const overviewItems: OverviewItem[] = [
        {
          title: "작년 본사 발주수익",
          value: ceoSale ? `${Number(ceoSale).toLocaleString()}원` : "0원",
          color: "text-green-600"
        },
        {
          title: "전체 누적 수강생",
          value: students ? Number(students).toLocaleString() : "0",
          color: "text-blue-600"
        },
        {
          title: "운영중인 학원 수",
          value: users ? Number(users).toLocaleString() : "0",
          color: "text-indigo-600"
        }
      ];

      return overviewItems;
    }
  });

  // 월별 매출 데이터
  const salesDataQuery = useQuery({
    queryKey: ['statistics', 'monthly-sales'],
    queryFn: async () => {
      const response = await fetch('api/ceo/overview/lastyearsale');
      const data = await response.json();
      console.log('Monthly Sales API Response:', data);
      // (0,0) 좌표 추가 + 필드명 변환
      const salesData = data.map((item: { MONTH: string; TOTAL_PRICE: number }) => ({
        month: `${Number(item.MONTH)}월`,
        sales: item.TOTAL_PRICE
      }));
      return [{ month: "0월", sales: 0 }, ...salesData];
    }
  });

  // 인기 강의 데이터
  const popularItemsQuery = useQuery<PopularLecture[]>({
    queryKey: ['statistics', 'popular-lectures'],
    queryFn: async () => {
      const response = await fetch('api/ceo/overview/popularlecture');
      const data = await response.json();
      console.log('Popular Lectures API Response:', data);
      // API 응답의 대문자 속성명을 소문자로 변환
      return data.map((item: PopularLectureResponse) => ({
        cdLecture: item.CD_LECTURE,
        lectureCount: item.LECTURE_COUNT
      }));
    }
  });

  return {
    overview: overviewQuery.data,
    salesData: salesDataQuery.data,
    popularItems: popularItemsQuery.data,
    isLoading: overviewQuery.isLoading || salesDataQuery.isLoading || popularItemsQuery.isLoading,
    error: overviewQuery.error || salesDataQuery.error || popularItemsQuery.error
  };
}; 