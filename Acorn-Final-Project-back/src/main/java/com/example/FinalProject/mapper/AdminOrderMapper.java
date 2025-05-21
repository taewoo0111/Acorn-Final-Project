package com.example.FinalProject.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.example.FinalProject.dto.EuOrderDto;
import com.example.FinalProject.dto.EuOrderItemDto;
import com.example.FinalProject.dto.EuOrderListDto;
import com.example.FinalProject.dto.EuProdcutListDto;
import com.example.FinalProject.dto.EuProductDto;

@Mapper
public interface AdminOrderMapper {

	// 발주 현황 리스트 조회
	List<EuOrderDto> getOrd(EuOrderListDto dto);
	
	// 발주 현황 리스트 개수
	int getOrdCnt(EuOrderListDto dto);
	
	// 특정 발주 상세보기 (1) 발주 정보
	EuOrderDto getOrdInfo(int ordId);
	
	// 특정 발주 상세보기 (2) 발주의 품목 정보
	List<EuOrderItemDto> getOrdItem(int ordId);
	
	// 주문 가능 품목 리스트 조회
	List<EuProductDto> getProduct(EuProdcutListDto dto);
	
	// 리스트에서 특정 품목을 발주서에 추가할 정보 가져오기
	EuProductDto getProductOne(int pId);
	
	
	
	// 새 발주서 추가 (0) 사용될 시퀀스 번호 구하기
	int getOrdSeq();
	
	// 새 발주서 추가 (1) 발주 정보 추가
	void addOrdInfo(EuOrderDto dto);
	
	// 새 발주서 추가 (2) 발주 품목 추가
	void addOrdItem(EuOrderItemDto dto);
	
	
	//
	void editToOrdInfo(EuOrderDto dto);
	
	// 기존 발주서 수정 (1) 발주서 정보 수정
	void editOrdInfo(EuOrderDto dto);
	
	// 기존 발주서 수정 (2) 발주 품목 다 지우기
	void deleteOrdItem(int ordSeq);
	
	// 기존 발주서 수정 (3) 발주서의 품목 정보
	// 위에 작성한 addOrdItem 메소드를 사용합니다.
	
	
	
	// 임시저장된 발주서가 있는지 확인
	int getTmpOrdId();
	
	// 발주서 삭제 (부모 테이블)
	void deleteOrdP(int pId);
	// 발주서 삭제 (자식 테이블)	
	void deleteOrdC(int pId);
	
	// 사용자의 지점 전화번호 가져오기
	String getStoreCall(int uerId);
	
}
