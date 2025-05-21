package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("HUI_OrderDetailDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
// 발주 내역에 포함된 품목 상세보기
public class HUI_OrderDetailDto {
	// 주문 상세 기본 정보(주문상세 + 현재 주문상태)
	int orderId;
	String ordDate;
	String orderName;
	String storeName;
	String storeCall;
	int totalPrice; 
	String cdStatus;
	
	// 품목 테이블 데이터 
	int productId; // 품목 번호 (tb_product 참조)
	String productName; // 상품명
	int price; // 개당 가격
	int quantity; // 수량
	int cost; // 개당 가격 * 수량
	String memoReply; // 본사 응답
	String memoRequest; // 지점 요청
	
	// 발주 내역에 포함된 품목 검색조건 
	String searchProductName;
	// 지점 ID
	int userId;
	
	
}
