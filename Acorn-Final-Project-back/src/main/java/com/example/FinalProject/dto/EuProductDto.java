package com.example.FinalProject.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class EuProductDto {
	public int productId;		// 품목 번호
	public String cdCategory; 	// 품목 구분
	public String productName;	// 품목 이름
	public int price;			// 품목 가격
}
