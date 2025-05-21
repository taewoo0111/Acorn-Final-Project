package com.example.FinalProject.dto;

import java.util.List;

// 발주서 작성 페이지
public class OrderListDto {

	public int orderId;
	public String orderName;
	public String userId;
	public String ordDate;
	public String memoReply;
	public String memoRequest;
	public int totalPrice;
	public String storeCall;
	public List<OrderDto> list ;
}
