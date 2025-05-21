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
public class EuProdcutListDto {
	
	// 검색 조건 정보 : 품목 분류 / 품목 번호 / 품목 이름
	private String condition;	// ctg / pnum / pname
	private String keyword;
	private int keyId;
	
	// 품목 리스트
	List<EuProductDto> list;		
}
