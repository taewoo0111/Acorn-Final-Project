package com.example.FinalProject.service;

import java.util.List;

import com.example.FinalProject.dto.HjClassDto;
import com.example.FinalProject.dto.JsAdminSalesDto;
import com.example.FinalProject.dto.JsAdminSalesStatDto;

public interface AdminSalesService {
	//매출 관리 리스트 : 검색 조건을 받아 한 페이지에 10개를 띄워주는 리스트를 만든다.
	public JsAdminSalesDto getAdminSalesList(int pageNum, Integer userId, List<String> checkedItems);
	public int addAdminSale(JsAdminSalesDto dto);
	public int editAdminSale(JsAdminSalesDto dto);
	public int deleteAdminSale(int adminSaleId);
	
	//통계 관련
	public List<JsAdminSalesStatDto> getSYears(String sYear, Integer userId);
	public List<JsAdminSalesStatDto> getSMonths(String sYear, Integer userId);
	public JsAdminSalesStatDto getYearlySalesStat(String sYear, Integer userId);
	public List<JsAdminSalesStatDto> getAdminProfitStatByYear(String sYear, Integer userId);
	public List<JsAdminSalesStatDto> getAdminCostStatByYear(String sYear, Integer userId);
	public JsAdminSalesStatDto getSalesStatsByLecture(String sYear, String sMonth, Integer userId);
	public List<JsAdminSalesStatDto> getAdminSalesStatByLectYearly(String sYear, Integer userId);
	public List<JsAdminSalesStatDto> getAdminSalesStatByLectMonthly(String sYear, String sMonth, Integer userId);
	

	//발주에서 실행할 메소드
	public int insertOrderApprovedCost(int orderId);

}
