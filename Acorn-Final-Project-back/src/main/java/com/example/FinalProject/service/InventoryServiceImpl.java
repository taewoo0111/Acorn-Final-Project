package com.example.FinalProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.EuInventoryDetailDto;
import com.example.FinalProject.dto.EuInventoryDetailListDto;
import com.example.FinalProject.dto.EuInventoryListDto;
import com.example.FinalProject.mapper.InventoryMapper;

@Service
public class InventoryServiceImpl implements InventoryService {

	@Autowired private InventoryMapper mapper;
	
	// 재고 현황 리스트의 카테고리 목록
	@Override
	public List<String> getCategory() {
		return mapper.getCategory();
	}
	
	// 품목 별 재고 현황 조회
	@Override
	public EuInventoryListDto getInvList(EuInventoryListDto dto) {
		// id 로 조회하는 경우 keyword 값을 id 필드로 옮기기
		if(dto.getCondition().equals("pid")) dto.setKeyId(Integer.parseInt(dto.getKeyword()));
		dto.setList(mapper.getInv(dto));
		return dto;
	}

	// 특정 품목의 사용 기록 조회
	@Override
	public EuInventoryDetailListDto getInvDetailList(EuInventoryDetailListDto dto) {
		dto.setList(mapper.getInvDetail(dto));
		return dto;
	}

	// 입고 및 사용 내역 추가 (+,-)
	@Override
	public void addInvDetail(EuInventoryDetailDto dto) {
		mapper.addInvDetail(dto);
	}

	// 입고 및 사용 내역 수정 (+,-)
	@Override
	public void editInvDetail(EuInventoryDetailDto dto) {
		mapper.editInvDetail(dto);
	}
	
	// 입고 및 사용 내역 삭제 
	@Override
	public void deleteInvDetail(int invId) {
		mapper.deleteInvDetail(invId);
	}

	// 수정을 위해 해당 재고 기록 하나의 세부 내용 가져오기
	@Override
	public EuInventoryDetailDto getInvDetailOne(int invId) {
		EuInventoryDetailDto dto = mapper.getInvDetailOne(invId);
		
		// 입고인지 사용인지 구분해주기
		if(dto.getInvPlus() > 0) dto.setDiv(1);
		else dto.setDiv(0);
		
		return dto;
	}
	

	// 품목 코드 입력했을 때 품목명 찾아오기
	@Override
	public String getPnameToPid(int pid) {
		return mapper.getPnameToPid(pid);
	}

	
	// 품목명 입력 했을 때 품목 아이디 찾아오기
	@Override
	public int getPidToPname(String pname) {
		return mapper.getPidToPname(pname);
	}
	
}
