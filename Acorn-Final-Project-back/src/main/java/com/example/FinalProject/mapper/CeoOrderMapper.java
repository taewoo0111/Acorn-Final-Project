package com.example.FinalProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.FinalProject.dto.HUI_OrderDetailDto;
import com.example.FinalProject.dto.HUI_OrderDto;
import com.example.FinalProject.dto.HUI_OrderRequestDto;

@Mapper
public interface CeoOrderMapper {
	// 본사 발주 내역 리스트 가져오기(검색조건 : 지점명 , 상태, 시작~끝날짜, 발주자)
	List<HUI_OrderDto> getOrderData(HUI_OrderRequestDto requestDto);
	
	// 총 행의 개수 구하기
	int getCount(HUI_OrderRequestDto requestDto);
	
	// 발주 상세 보기 페이지 기본정보
	HUI_OrderDetailDto getOrderInfo(int orderId);

	// 발주 상세 보기 품목데이터 가져오기 + 지점 요청 메세지 가져오기 + 상품명 검색
	List<HUI_OrderDetailDto> getOrderDetail(HUI_OrderDetailDto detailDto);
	
	// 메모 저장하기
	int updateReply(HUI_OrderDetailDto detailDto);

	// 승인 처리하기
	int updateApp(HUI_OrderDetailDto detailDto);

	// 반려 처리하기
	int updateRej(HUI_OrderDetailDto detailDto);
	
}
