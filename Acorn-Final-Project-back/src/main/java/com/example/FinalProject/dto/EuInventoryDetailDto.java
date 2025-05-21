package com.example.FinalProject.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class EuInventoryDetailDto {
	private int invId;			// 재고 아이디
	private int userId;			// 기록자 계정 아이디
	private int productId;		// 품목 코드
	private String productName;	// 품목 이름
	private String invDate;		// 기록 날짜
	private int invPlus;		// 입고 수량
	private int invMinus;		// 사용 수량
	private int div;			// 구분 : 0 이면 -사용, 1 이면 +입고
}
