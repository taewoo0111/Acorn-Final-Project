package com.example.FinalProject.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.HUI_OrderDetailDto;
import com.example.FinalProject.dto.HUI_OrderDto;
import com.example.FinalProject.dto.HUI_OrderRequestDto;
import com.example.FinalProject.dto.TWCeoSaleDto;
import com.example.FinalProject.mapper.CeoOrderMapper;
import com.example.FinalProject.mapper.CeoSaleMapper;

import lombok.Data;

@Service
@Data
public class CeoOrderServiceImpl implements CeoOrderService {

	// 한 페이지에 몇개씩 표시할 것인지
	final int PAGE_ROW_COUNT = 10;
	// 하단 페이지를 몇개씩 표시할 것인지
	final int PAGE_DISPLAY_COUNT = 5;

	@Autowired
	private CeoOrderMapper mapper;
	@Autowired
	private CeoSaleMapper ceoSaleMapper;

	@Override
	public Map<String, Object> getOrderData(HUI_OrderRequestDto requestDto) {
		// 본사 발주 내역 리스트 가져오기(검색조건 : 지점명 , 상태, 시작~끝날짜, 발주자)
		int pageNum = requestDto.getPageNum();

		// 보여줄 페이지의 시작 ROWNUM
		int startRowNum = 1 + (pageNum - 1) * PAGE_ROW_COUNT;
		// 보여줄 페이지의 끝 ROWNUM
		int endRowNum = pageNum * PAGE_ROW_COUNT;

		// 하단 시작 페이지 번호
		int startPageNum = 1 + ((pageNum - 1) / PAGE_DISPLAY_COUNT) * PAGE_DISPLAY_COUNT;
		// 하단 끝 페이지 번호
		int endPageNum = startPageNum + PAGE_DISPLAY_COUNT - 1;
		// 전체 글의 갯수
		int totalRow = mapper.getCount(requestDto);
		// 전체 페이지의 갯수 구하기(이동 버튼)
		int totalPageCount = (int) Math.ceil(totalRow / (double) PAGE_ROW_COUNT);
		// 끝 페이지 번호가 이미 전체 페이지 갯수보다 크게 계산되었다면 잘못된 값이다.
		if (endPageNum > totalPageCount) {
			endPageNum = totalPageCount; // 보정해 준다.
		}

		// startRowNum 과 endRowNum 을 PostDto 객체에 담아서
		requestDto.setStartRowNum(startRowNum);
		requestDto.setEndRowNum(endRowNum);

		// 발주 목록 얻어오기
		List<HUI_OrderDto> list = mapper.getOrderData(requestDto);
		System.out.println(mapper.getOrderData(requestDto));
		Map<String, Object> result = new HashMap<>();
		result.put("list", list);
		result.put("pageNum", pageNum);
		result.put("startPageNum", startPageNum);
		result.put("endPageNum", endPageNum);
		result.put("totalPageCount", totalPageCount);
		result.put("totalRow", totalRow);

		System.out.println(requestDto);
		return result;
	}

	@Override
	public HUI_OrderDetailDto getOrderInfo(int orderId) {
		// 발주 상세 보기 페이지 기본정보
		return mapper.getOrderInfo(orderId);
	}

	@Override
	public Map<String, Object> getOrderDetail(HUI_OrderDetailDto detailDto) {
		// 발주 상세 보기 품목데이터 가져오기 + 상품명 검색
		List<HUI_OrderDetailDto> list = mapper.getOrderDetail(detailDto);
		Map<String, Object> result = new HashMap<>();
		result.put("list", list);
		return result;
	}

	@Override
	public int updateReply(HUI_OrderDetailDto detailDto) {
		// 메모 저장하기
		return mapper.updateReply(detailDto);
	}

	@Override
	public int updateApp(HUI_OrderDetailDto detailDto) {
		// 승인 처리하기
//		mapper.updateApp(detailDto);
		int userId = 9999;
		String saleName = detailDto.getOrderId() + "번 발주서";
		TWCeoSaleDto dto = TWCeoSaleDto.builder().userId(userId).saleName(saleName).price(detailDto.getPrice()).build();
//		ceoSaleMapper.insertEtcProfit(dto);
		return mapper.updateApp(detailDto);
	}

	@Override
	public int updateRej(HUI_OrderDetailDto detailDto) {
		// 반려 처리하기
		return mapper.updateRej(detailDto);
	}

	@Override
	public int getCount(HUI_OrderRequestDto requestDto) {
		// 발주 내역 리스트 페이징 처리의 총 행의 개수 구하기
		return mapper.getCount(requestDto);
	}

}
