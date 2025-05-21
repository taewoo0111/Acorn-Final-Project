package com.example.FinalProject.service;

import java.util.List;
import java.util.Map;

import com.example.FinalProject.dto.HUI_OrderDetailDto;
import com.example.FinalProject.dto.HUI_OrderDto;
import com.example.FinalProject.dto.HUI_OrderRequestDto;

public interface CeoOrderService {
	// 본사 발주 내역 리스트 가져오기
	public Map<String, Object> getOrderData(HUI_OrderRequestDto requestDto);
	// 페이징 처리 총 행의 개수 구하기
	public int getCount(HUI_OrderRequestDto requestDto);
	// 발주 상세 보기 페이지 기본정보
	public HUI_OrderDetailDto getOrderInfo(int orderId);
	// 발주 상세 보기 품목데이터 가져오기 + 상품명 검색
	public Map<String, Object> getOrderDetail(HUI_OrderDetailDto detailDto);
	// 메모 저장하기
	public int updateReply(HUI_OrderDetailDto detailDto);
	// 승인 처리하기
	public int updateApp(HUI_OrderDetailDto detailDto);
	// 반려 처리하기
	public int updateRej(HUI_OrderDetailDto detailDto);
}
