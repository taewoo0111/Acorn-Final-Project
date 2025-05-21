package com.example.FinalProject.dto;

import lombok.Data;

@Data
// 발주 내역 검색 조건과 페이징 처리
public class HUI_OrderRequestDto {
	// 페이징 처리
	private int startRowNum;
	private int endRowNum;
	// 페이징 처리 숫자 번호
	private int startPageNum;
	private int endPageNum;
	private int totalPageCount;
	private int pageNum;
	private int totalRow;
	
	// 검색조건(프론트부터 받아옴)
	private String storeName;
	private String cdStatus;
	private String startDate;
	private String endDate;
	private String orderName;
}
