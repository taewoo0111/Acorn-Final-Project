package com.example.FinalProject.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.HUI_OrderDetailDto;
import com.example.FinalProject.dto.HUI_OrderDto;
import com.example.FinalProject.dto.HUI_OrderRequestDto;
import com.example.FinalProject.service.AdminSalesService;
import com.example.FinalProject.service.CeoOrderService;

import lombok.Data;

@RestController
@Data
public class CeoOrderController {
	
	@Autowired private CeoOrderService service;
	@Autowired private AdminSalesService saleservice;
	
	// 테스트용 
	@GetMapping("/ceo/sample")
	public String sample() {
		return "테스트입니다!";
	}
	
	// 본사 발주 내역 리스트 가져오기 VV
	@PostMapping("/orders")
	public Map<String, Object> getOrderData(@RequestBody HUI_OrderRequestDto requestdto){
		int pageNum = requestdto.getPageNum();
		// 1보다 작은 pageNum 일 시 1로 초기화
		if (pageNum < 1) pageNum = 1;
		requestdto.setPageNum(pageNum);
		return service.getOrderData(requestdto);
	}
	
	
	// 발주 상세 보기 페이지 기본정보 VV
	@GetMapping("/orders/info/{orderId}")
	public HUI_OrderDetailDto getOrderInfo(@PathVariable int orderId) {
		return service.getOrderInfo(orderId);
	}
	
	// 발주 상세 보기 품목정보 가져오기  상품명 검색 VV
	@GetMapping("/orders/product")
	public Map<String, Object> getOrderDetail(@RequestParam int orderId, @RequestParam(required = false) String productName ){
		HUI_OrderDetailDto detailDto = new HUI_OrderDetailDto();
		detailDto.setOrderId(orderId);
		// 상품명 검색어를 입력했을때 넣어서 보낸다.
		if (productName != null && !productName.isEmpty()) {
		    detailDto.setSearchProductName("%" + productName + "%");
		}
		
		return service.getOrderDetail(detailDto);
	}
	
	
	// 메모 저장하기 VV
	@PatchMapping("/orders/memoreply")
	public int updateReply(@RequestBody HUI_OrderDetailDto detailDto) {
		return service.updateReply(detailDto);
	}
		
	// 승인 처리하기 VV
	@PatchMapping("/orders/app")
	public int updateApp(@RequestBody HUI_OrderDetailDto detailDto) {
		saleservice.insertOrderApprovedCost(detailDto.getOrderId());
		System.out.println("인서트 성공!");
		return service.updateApp(detailDto);
	}
		
	// 반려 처리하기 VV
	@PatchMapping("/orders/rej")
	public int updateRej(@RequestBody HUI_OrderDetailDto detailDto) {
		return service.updateRej(detailDto);
	}
	
	
	
	
}
