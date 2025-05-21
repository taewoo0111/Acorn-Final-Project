package com.example.FinalProject.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.FinalProject.dto.HUI_OrderDetailDto;
import com.example.FinalProject.dto.HjClassDto;
import com.example.FinalProject.dto.JsAdminSalesDto;
import com.example.FinalProject.dto.JsAdminSalesStatDto;
import com.example.FinalProject.dto.JsClsToProfitDto;
import com.example.FinalProject.dto.JsOrderToCostDto;
import com.example.FinalProject.mapper.AdminSalesMapper;
import com.example.FinalProject.mapper.CeoOrderMapper;

@Service
public class AdminSalesServiceImpl implements AdminSalesService {

	//한 페이지에 몇개씩 표시할 것인지
	final int PAGE_ROW_COUNT=10;
	//하단 페이지를 몇개씩 표시할 것인지
	final int PAGE_DISPLAY_COUNT=5;
	Integer userId;

	@Autowired AdminSalesMapper salesmapper;
	@Autowired CeoOrderMapper ordermapper;
	
	//매출 관리 리스트 : 검색 조건을 받아 리스트 불러오기
	@Override
	public JsAdminSalesDto getAdminSalesList(int pageNum, Integer userId, List<String> checkedItems) {
		//보여줄 페이지의 시작 ROWNUM
		int startRowNum=1+(pageNum-1)*PAGE_ROW_COUNT;
		//보여줄 페이지의 끝 ROWNUM
		int endRowNum=pageNum*PAGE_ROW_COUNT;
		//하단 시작 페이지 번호 
		int startPageNum = 1 + ((pageNum-1)/PAGE_DISPLAY_COUNT)*PAGE_DISPLAY_COUNT;
		//하단 끝 페이지 번호
		int endPageNum=startPageNum+PAGE_DISPLAY_COUNT-1;
		//전체 글의 갯수
		int totalRow;
		// 검색 조건 및 페이징 정보를 Map에 담음
    	Map<String, Object> search = new HashMap<>();
    	search.put("userId", userId);
    	System.out.println(userId);
    	search.put("checkedItems", checkedItems); // b_codes는 null일 수도 있음
    	//startRownum과 endrownum을담 아서 
    	search.put("startRowNum", startRowNum);
    	search.put("endRowNum", endRowNum);
        totalRow = ( checkedItems == null || checkedItems.isEmpty())
                ? salesmapper.getCountDefault()
                : salesmapper.getCount(search);
		//전체 페이지의 갯수 구하기
		int totalPageCount=(int)Math.ceil(totalRow/(double)PAGE_ROW_COUNT);
		//끝 페이지 번호가 이미 전체 페이지 갯수보다 크게 계산되었다면 잘못된 값이다.
		if(endPageNum > totalPageCount){
			endPageNum=totalPageCount; //보정해 준다. 
		}
	
		List<JsAdminSalesDto> salesList = salesmapper.getAdminSalesList(search); // 항상 이거 사용
        System.out.println(search);
        // DTO에 값 설정해서 리턴
        JsAdminSalesDto dto = new JsAdminSalesDto();
        dto.setList(salesList);
        dto.setPageNum(pageNum);
        dto.setStartPageNum(startPageNum);
        dto.setEndPageNum(endPageNum);
        dto.setTotalPageCount(totalPageCount);
        dto.setTotalRow(totalRow);
        dto.setStartRowNum(startRowNum);
        dto.setEndRowNum(endRowNum);

        return dto;
	}


	@Override
	public int addAdminSale(JsAdminSalesDto dto) {
		System.out.println(dto);
		dto.setAdminSaleId(null);
		salesmapper.insertAdminSales(dto);
		return 0;
	}


	@Override
	public int editAdminSale(JsAdminSalesDto dto) {
		salesmapper.editAdminSales(dto);
		return 0;
	}


	@Override
	public int deleteAdminSale(int adminSaleId) {
		salesmapper.deleteAdminSales(adminSaleId);
		return 0;
	}


	@Override
	public List<JsAdminSalesStatDto> getSYears(String sYear, Integer userId) {
		// 연도 목록 가져오기
	    List<JsAdminSalesStatDto> yearList = salesmapper.getSYear(userId); // sYear만 채워진 DTO 리스트
	    return yearList;
	}

	

	@Override
	public List<JsAdminSalesStatDto> getSMonths(String sYear, Integer userId) {
	    Map<String, Object> search = new HashMap<>();
	    search.put("userId", userId);
	    search.put("sYear", sYear);
	    // 연도 기준으로 월 목록 가져오기
	    List<JsAdminSalesStatDto> monthList = salesmapper.getSMonth(search);  // sMonth만 채워진 DTO 리스트
	    return monthList;
	}


	@Override
	public JsAdminSalesStatDto getYearlySalesStat(String sYear, Integer userId){
		//연도별로 과목별 연매출, 과목별 월별 매출들을 담은 dto
		JsAdminSalesStatDto dto = new JsAdminSalesStatDto();
	    List<JsAdminSalesStatDto> sYearList = this.getSYears(sYear, userId);
	    for (JsAdminSalesStatDto yearDto : sYearList) {
	        String targetYear = yearDto.getSYear(); // 예: "2025", "2024"
	        // 각각의 연도별 수익/지출을 가져와서 yearDto의 list에 세팅
	        List<JsAdminSalesStatDto> profitList = this.getAdminProfitStatByYear(targetYear, userId);
	        List<JsAdminSalesStatDto> costList = this.getAdminCostStatByYear(targetYear, userId);
	        // 각각 list에 담기 (프론트에서 profit/cost 구분 가능하다면 list에 섞어도 됨)
	        yearDto.setProfitList(profitList);
	        yearDto.setCostList(costList);
	    }
	    dto.setSYear(sYear);
	    dto.setSYearList(sYearList);
	    return dto;
		
	}
	
	@Override
	public List<JsAdminSalesStatDto> getAdminProfitStatByYear(String sYear, Integer userId) {
		// 수입 조회
	    Map<String, Object> profitSearch = new HashMap<>();
	    profitSearch.put("userId", userId);
	    profitSearch.put("sYear", sYear);
	    List<JsAdminSalesStatDto> profitList = salesmapper.getAdminProfitStatByYear(profitSearch);
	    return profitList;
	}


	@Override
	public List<JsAdminSalesStatDto> getAdminCostStatByYear(String sYear, Integer userId) {
	    // 지출 조회
	    Map<String, Object> costSearch = new HashMap<>();
	    costSearch.put("userId", userId);
	    costSearch.put("sYear", sYear);
	    List<JsAdminSalesStatDto> costList = salesmapper.getAdminCostStatByYear(costSearch);
	    return costList;
	}

	
	
	public JsAdminSalesStatDto getSalesStatsByLecture(String sYear, String sMonth, Integer userId) {
	    JsAdminSalesStatDto dto = new JsAdminSalesStatDto();
	    List<JsAdminSalesStatDto> sYearList = salesmapper.getSYearList(userId);  // 연도 목록
	    for(JsAdminSalesStatDto yearDto: sYearList) {
	    	String targetYear=yearDto.getSYear();
	    	
	    	//연도별 매출
	    	List<JsAdminSalesStatDto> yearlyStats = this.getAdminSalesStatByLectYearly(targetYear, userId);
		    System.out.println(yearlyStats+"연매출정보입니다");
	    	Map<String, Object> search = new HashMap<>();
		    search.put("userId", userId);
		    search.put("sYear", targetYear);
	    	List<JsAdminSalesStatDto> sMonthList = salesmapper.getSMonthList(search);//월 목록
	    	yearDto.setLectSaleYearly(yearlyStats);
	    	yearDto.setSMonthList(sMonthList);
	    	for(JsAdminSalesStatDto monthDto : sMonthList) {
		    	String targetMonth=monthDto.getSMonth();
		    	//월별 매출
		    	List<JsAdminSalesStatDto> monthlyStats= this.getAdminSalesStatByLectMonthly(targetYear, targetMonth, userId);
		    	
		    	//연도별 매출과 월별매출을 list에 담기
		    	monthDto.setLectSaleMonthly(monthlyStats);
	    	}
	    	
	    }
	    
	    dto.setSYear(sYear);
	    dto.setSYearList(sYearList);
	    System.out.println("결과"+dto);
	    return dto;
	}
	
	
	@Override
	public List<JsAdminSalesStatDto> getAdminSalesStatByLectYearly(String sYear, Integer userId) {
		 Map<String, Object> paramMap = new HashMap<>();
		 paramMap.put("sYear", sYear);
		 paramMap.put("userId", userId);
		 return salesmapper.getAdminSalesStatByLectYearly(paramMap);
	}


	@Override
	public List<JsAdminSalesStatDto> getAdminSalesStatByLectMonthly(String sYear, String sMonth, Integer userId) {
	   
	    Map<String, Object> paramMap = new HashMap<>();
	    paramMap.put("sYear", sYear);
	    paramMap.put("sMonth", sMonth);
	    paramMap.put("userId", userId);
	    return salesmapper.getAdminSalesStatByLectMonthly(paramMap);
	}
	
	
	



	//발주에서 실행할 메소드 : 발주 승인 시 매출 테이블에 자동 등록
	@Override @Transactional
	public int insertOrderApprovedCost(int orderId) {
		// 본사 발주서 상세페이이 dto 이용해서 UserId 가져오기
		HUI_OrderDetailDto orderDto = ordermapper.getOrderInfo(orderId);
		int userId = orderDto.getUserId();
		
//		JsOrderToCostDto costDto=salesmapper.getApprovedOrderInfoByOrderId(orderId);
//		int userId= costDto.getUserId();

		Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("userId", userId);
        paramMap.put("orderId", orderId);

		List<JsOrderToCostDto> list= salesmapper.getOrderDetailInfoByOrderId(paramMap);
	    int totalInserted = 0;
	
		for (JsOrderToCostDto dto : list) {

			// 위에서 가져온 userId 를 JsOrderToCostDto 에 담아서 지점 매출 데이터 넣기
			dto.setUserId(userId);
			dto.setSaleName(dto.getProductName());
			dto.setPrice(dto.getTotal());

			try {
				int a = salesmapper.insertOrderApprovedCostToAdmin(dto);
		        int b = salesmapper.insertOrderApprovedCostToCeo(dto);
	
		        // 필요하면 총합 계산
		        totalInserted += a + b;
	
				} catch (Exception e) {
		            // 어떤 하나라도 실패하면 전체 트랜잭션 롤백
		            throw new RuntimeException("발주 승인 매출 등록 중 오류 발생. 전체 작업이 취소됩니다.", e);
		        }
		    }
	
		return totalInserted;
		
	}

}
