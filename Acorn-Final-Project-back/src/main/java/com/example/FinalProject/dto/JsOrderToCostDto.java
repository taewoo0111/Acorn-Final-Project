package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("JsOrderToCostDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class JsOrderToCostDto {
	private int userId;
	private int orderId;
	private String ordDate;
	private String cdStatus;
	private String orderName;
	private int orderDetailId;
	private String productName;
	private String cdCategory;
	private int quantity;
	private int price;
	private int total;
	private String saleName;
}
