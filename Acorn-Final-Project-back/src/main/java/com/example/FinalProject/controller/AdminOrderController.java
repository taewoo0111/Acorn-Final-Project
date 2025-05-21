package com.example.FinalProject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.EuOrderDetailDto;
import com.example.FinalProject.dto.EuOrderListDto;
import com.example.FinalProject.dto.EuProdcutListDto;
import com.example.FinalProject.dto.EuProductDto;
import com.example.FinalProject.service.AdminOrderService;

@RestController
public class AdminOrderController {

	@Autowired private AdminOrderService service;
	
	@GetMapping("/ord/ping")
	public String ping() {
		return "pong";
	}
	
	// 사용자 지점 전화번호 가져오기
	@GetMapping("/user/store-call/{userId}")
	public String getStoreCall(@PathVariable(value="userId") int userId) {
		System.out.println("전달받은 사용자 아이디:"+userId);
		System.out.println(service.getStoreCall(userId));
		return service.getStoreCall(userId);
	}
	
	// 발주 현황 리스트 조회
	@GetMapping("/ord/{pNum}")
	public EuOrderListDto getOrderList(@PathVariable(value="pNum") int pNum, EuOrderListDto dto){
		System.out.println("발주 현황 리스트 메소드 들어옴");
		System.out.println("-------pnum: " + pNum);
		System.out.println("-------dto: " + dto);
		return service.getOrdList(pNum, dto);
	}
	
	// 특정 발주 상세보기
	@GetMapping("/ord/detail/{ordId}")
	public EuOrderDetailDto getOrderDetail(@PathVariable(value="ordId") int ordId) {
		return service.getOrdDetail(ordId);
	}
	
	
	// 주문 가능 품목 리스트 조회
	@GetMapping("/pdt")
	public EuProdcutListDto getProductList(EuProdcutListDto dto) {
		System.out.println("추가가능한 품목 리스트 들어옴");
		System.out.println("----"+dto);
		return service.getProductList(dto);
	}
	
	// 리스트에서 특정 품목을 발주서에 추가할 정보 가져오기
	@GetMapping("/pdt/{pId}")
	public EuProductDto getProduct(@PathVariable(value="pId") int pId) {
		// 추가가능한 품목 리스트
		return service.getProduct(pId);
	}
	
	// 새 발주서 추가 (또는 임시 저장)			
	@PostMapping("/ord/add")
	public void addOrder(@RequestBody EuOrderDetailDto dto) {
		System.out.println("새 발주 추가 메소드 들어옴");
		System.out.println("전달 받은 dto: "+dto);
		service.addOrd(dto);
		System.out.println("555");
	}

	// 기존 발주서 수정	 (또는 임시 저장 발주서를 발주 요청)		
	@PatchMapping("/ord/edit")	
	public void editOrder(@RequestBody EuOrderDetailDto dto) {
		System.out.println("기존 발주 수정 메소드 들어옴");
		System.out.println("전달 받은 dto: "+dto);
		service.editOrd(dto);
		System.out.println("555");
	}
	
	// 기존 발주서 수정	 (또는 임시 저장 발주서를 발주 요청)		
	@PatchMapping("/ord/edit-order")	
	public void editToOrder(@RequestBody EuOrderDetailDto dto) {
		System.out.println("기존 발주 수정 메소드 들어옴");
		System.out.println("전달 받은 dto: "+dto);
		service.editToOrd(dto);
		System.out.println("555");
	}
	
	// 임시저장된 발주서가 있는지 확인 
	@GetMapping("/ord/tmp")
	public int getTemporaryOrderId() {
		return service.getTmpOrdId();
	}
	
	
	// 발주서 삭제
	@DeleteMapping("/ord/del/{pId}")
	public void deleteOrder(@PathVariable(value="pId") int pId) {
		System.out.println(pId);
		service.deletedOrd(pId);
	}
	
	
}
