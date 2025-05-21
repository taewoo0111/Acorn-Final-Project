import { useQuery } from '@tanstack/react-query';

export interface OverviewData {
  students: number;
  teachers: number;
  classes: number;
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

export const useAdminStatistics = () => {
  // localStorage에서 userId 가져오기
  const getUserId = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?.userId;
  };

  // Overview 데이터
  const overviewQuery = useQuery({
    queryKey: ['admin-statistics', 'overview'],
    queryFn: async () => {
      const userId = getUserId();
      if (!userId) throw new Error('User ID not found');

      const [students, teachers, classes] = await Promise.all([
        fetch(`api/admin/overview/students?userId=${userId}`).then(res => res.json()),
        fetch(`api/admin/overview/teachers?userId=${userId}`).then(res => res.json()),
        fetch(`api/admin/overview/class?userId=${userId}`).then(res => res.json())
      ]);

      const overviewItems: OverviewItem[] = [
        {
          title: "전체 수강생",
          value: students ? Number(students).toLocaleString() : "0",
          color: "text-blue-600"
        },
        {
          title: "전체 강사",
          value: teachers ? Number(teachers).toLocaleString() : "0",
          color: "text-green-600"
        },
        {
          title: "운영중인 강의",
          value: classes ? Number(classes).toLocaleString() : "0",
          color: "text-indigo-600"
        }
      ];

      return overviewItems;
    }
  });

  // 월별 매출 데이터
  const salesDataQuery = useQuery({
    queryKey: ['admin-statistics', 'monthly-sales'],
    queryFn: async () => {
      const userId = getUserId();
      if (!userId) throw new Error('User ID not found');
      const response = await fetch(`api/admin/overview/lastyearsale/${userId}`);
      const data = await response.json();
      console.log('API 응답:', data);
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
    queryKey: ['admin-statistics', 'popular-lectures'],
    queryFn: async () => {
      const userId = getUserId();
      if (!userId) throw new Error('User ID not found');

      const response = await fetch(`api/admin/overview/popularlecture?userId=${userId}`);
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