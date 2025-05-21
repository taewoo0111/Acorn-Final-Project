package com.example.FinalProject.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.FinalProject.dto.HjClassDto;
import com.example.FinalProject.dto.JsAdminSalesDto;
import com.example.FinalProject.dto.JsAdminSalesStatDto;
import com.example.FinalProject.dto.JsClsToProfitDto;
import com.example.FinalProject.dto.JsOrderToCostDto;
@Mapper
public interface AdminSalesMapper {
	//Admin 측
	//지점번호와 bcode를 넣어서 수입/지출 리스트를 가져오기
	List<JsAdminSalesDto> getAdminSalesList(Map<String, Object> search);
	int getCountDefault();
	int getCount(Map<String, Object> search);
	JsAdminSalesDto getAdminSaleById(int adminsaleid);
	int insertAdminSales(JsAdminSalesDto dto);
	int editAdminSales(JsAdminSalesDto dto);
	int deleteAdminSales(int adminsaleid);//
	
	//통계 관련
	//전체 연도 불러오기(adminSale테이블에서)
	List<JsAdminSalesStatDto> getSYear(Integer userId);
	//전체 월 불러오기(adminSale테이블에서)
	List<JsAdminSalesStatDto> getSMonth(Map<String, Object> search);
	//연도별 수입 데이터 불러오기
	List<JsAdminSalesStatDto> getAdminProfitStatByYear(Map<String, Object> search);
	//연도별 지출 데이터 불러오기
	List<JsAdminSalesStatDto> getAdminCostStatByYear(Map<String, Object> search);
	
	//전체 연도 불러오기(adminSale테이블에서)
	List<JsAdminSalesStatDto> getSYearList(Integer userId);
	//전체 월 불러오기(adminSale테이블에서)
	List<JsAdminSalesStatDto> getSMonthList(Map<String, Object> search);
	//연도별 과목별 데이터 불러오기
	List<JsAdminSalesStatDto> getAdminSalesStatByLectYearly(Map<String, Object> search);
	//연도의 월별 과목별 데이터 불러오기
	List<JsAdminSalesStatDto> getAdminSalesStatByLectMonthly(Map<String, Object> search);
	

	//수업이 '진행중'일 때 수업료 수입을 추가하는 메소드와 관련 메소드(수업에서 사용)
	boolean insertClsProfitToAdmin(HjClassDto dto);

	//발주가 "승인"일 때 발주 비용 추가하는 메소드와 관련 메소드(발주에서 사용) 
	int insertOrderApprovedCostToAdmin(JsOrderToCostDto dto);
	int insertOrderApprovedCostToCeo(JsOrderToCostDto dto);
	JsOrderToCostDto getApprovedOrderInfoByOrderId(int orderId);
	List<JsOrderToCostDto> getOrderDetailInfoByOrderId(Map<String, Object> search);

}
