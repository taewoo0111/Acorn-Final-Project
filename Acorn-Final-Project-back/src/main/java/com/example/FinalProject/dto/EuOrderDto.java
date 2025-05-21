package com.example.FinalProject.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class EuOrderDto {
	boolean tmp;				// 임시 저장 여부 (isTmp 라고 명명하면 오류 발생 ㅠㅠ)
	public int orderId;			// 발주 번호
	public int totalPrice;		// 발주 금액
	public String ordDate;		// 발주 일자
	public String orderName;	// 발주자 이름
	public int userId;		// 발주자 계정 번호
	public String cdStatus;		// 발주 상태
	public String storeName; 	// 발주 지점
	public String storeCall;	// 발주 연락처
	public String memoRequest;	// 지점 메모
	public String memoReply;	// 본점 메모
	
	
}
