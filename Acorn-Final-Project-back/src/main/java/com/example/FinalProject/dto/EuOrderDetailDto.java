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
public class EuOrderDetailDto {
	
	// 발주 메인 정보
	EuOrderDto infoDto;
	// 발주 품목
	List<EuOrderItemDto> itemList;
}