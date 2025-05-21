package com.example.FinalProject.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
// 주문 품목 하나가 가지고 있는 데이터
public class EuOrderItemDto {
	public int orderId;
	public int productId;
	public int quantity;
	public int price;
	public String productName;
}
