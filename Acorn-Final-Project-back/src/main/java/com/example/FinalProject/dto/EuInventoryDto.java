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
public class EuInventoryDto {
	
	private String cdCategory;	// 품목 분류
	private int productId;		// 품목 번호
	private String productName;	// 품목 이름
	private int qty;			// 재고 수량
	
	
}
