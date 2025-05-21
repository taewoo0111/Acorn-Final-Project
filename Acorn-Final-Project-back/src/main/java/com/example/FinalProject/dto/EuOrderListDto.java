package com.example.FinalProject.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class EuOrderListDto {
	// 조회 조건
	private String status;		// 발주 상태: 발주중(PEN) / 반려(REJ) / 승인(APP) 또는 모두(ALL)
	private String strDate;		// 시작 일자
	private String endDate;		// 끝 일자
	
	// 페이징
	private int startPageNum;		// 시작 페이지 번호
	private int endPageNum;			// 끝 페이지 번호
	private int totalPageCount;		// 총 페이지 개수
	private int pageNum;			// 현재 페이지 번호
	private int totalRow;			// 총 글 개수
	private int startRowNum;		// 시작 줄 번호
	private int endRowNum;			// 끝 줄 번호
	//private String findQuery;		// 페이지 및 검색 조건 쿼리문
		
	// 목록
	private List<EuOrderDto> list;
	
}
