package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("ProductDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class HCProductDto {
	private int productId;
	private String productName;
	private String cdCategory;
	private int price;
	
	private int startRowNum;
	private int endRowNum;
	private String keyword; 
}