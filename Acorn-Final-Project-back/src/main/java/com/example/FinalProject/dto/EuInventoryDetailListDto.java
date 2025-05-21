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
public class EuInventoryDetailListDto {
	// 검색 조건 : 날짜
	private String strDate;
	private String endDate;
	private int pId;
	
	// 재고 현황 목록
	private List<EuInventoryDetailListDto> list;
	
}
