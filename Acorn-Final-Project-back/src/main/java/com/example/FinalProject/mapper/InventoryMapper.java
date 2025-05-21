package com.example.FinalProject.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;

import com.example.FinalProject.dto.EuInventoryDetailDto;
import com.example.FinalProject.dto.EuInventoryDetailListDto;
import com.example.FinalProject.dto.EuInventoryDto;
import com.example.FinalProject.dto.EuInventoryListDto;

@Mapper
public interface InventoryMapper {

	// 재고 현황 리스트의 카테고리 목록
	List<String> getCategory();
	
	// 품목 별 재고 현황 조회
	List<EuInventoryDto> getInv(EuInventoryListDto dto);
	
	// 특정 품목의 사용 기록 조회
	List<EuInventoryDetailListDto> getInvDetail(EuInventoryDetailListDto dto);
	
	// 입고 및 사용 내역 추가 (+,-)
	void addInvDetail(EuInventoryDetailDto dto);
	
	// 수정을 위해 해당 재고 기록 하나의 세부 내용 가져오기
	EuInventoryDetailDto getInvDetailOne(int invId);
	
	// 입고 및 사용 내역 수정 (+,-)
	void editInvDetail(EuInventoryDetailDto dto);
	
	// 입고 및 사용 내역 삭제 
	void deleteInvDetail(int invId);
	
	// 품목 코드 입력했을 때 품목명 찾아오기
	String getPnameToPid(int pid);
	
	// 품목명 입력 했을 때 품목 아이디 찾아오기
	int getPidToPname(String pname);
}
