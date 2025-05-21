package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("HUI_OrderDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
// 발주 주문 담는 dto 
public class HUI_OrderDto {
	int orderId;
	String orderName;
	int userId;
	String creDate;
	String editDate;
	String rejDate;
	String ordDate;
	String cdStatus;
	String memoReply;
	String memoRequest;
	int totalPrice;
	
	// 본사 발주 내역 조회 지점명
	String storeName;
	
	
}
