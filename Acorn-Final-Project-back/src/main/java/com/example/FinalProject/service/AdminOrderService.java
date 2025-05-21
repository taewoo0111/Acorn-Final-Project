package com.example.FinalProject.service;

import java.util.List;

import com.example.FinalProject.dto.EuOrderDetailDto;
import com.example.FinalProject.dto.EuOrderListDto;
import com.example.FinalProject.dto.EuProdcutListDto;
import com.example.FinalProject.dto.EuProductDto;

public interface AdminOrderService {

	// 발주 현황 리스트 조회
	public EuOrderListDto getOrdList(int pNum, EuOrderListDto dto);
	
	// 특정 발주 상세보기
	public EuOrderDetailDto getOrdDetail(int ordId);
	
	// 주문 가능 품목 리스트 조회
	public EuProdcutListDto getProductList(EuProdcutListDto dto);
	
	// 리스트에서 특정 품목을 발주서에 추가할 정보 가져오기
	public EuProductDto getProduct(int pId);
	
	// 새 발주서 추가 (또는 임시저장)
	public void addOrd(EuOrderDetailDto dto);
	
	// 기존 발주서 수정
	public void editOrd(EuOrderDetailDto dto);
	
	// 임시 저장된 발주서를 요청
	public void editToOrd(EuOrderDetailDto dto);
	
	// 임시저장된 발주서가 있는지 확인
	public int getTmpOrdId();
	
	// 발주서 삭제
	public void deletedOrd(int ordId);
	
	// 사용자의 지점 전화번호
	public String getStoreCall(int userId);
}
