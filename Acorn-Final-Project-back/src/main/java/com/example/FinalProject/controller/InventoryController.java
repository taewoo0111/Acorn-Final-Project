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

import com.example.FinalProject.dto.EuInventoryDetailDto;
import com.example.FinalProject.dto.EuInventoryDetailListDto;
import com.example.FinalProject.dto.EuInventoryListDto;
import com.example.FinalProject.service.InventoryService;

@RestController
public class InventoryController {

	@Autowired private InventoryService service;
	
	@GetMapping("/inv/ping")
	public String ping() {
		return "pong";
	}
	
	// 재고 현황 리스트의 카테고리 목록
	@GetMapping("/inv/category")
	public List<String> getMethodName() {
		return service.getCategory();
	}
	
	// 품목 별 재고 현황 조회 
	@GetMapping("/inv")
	public EuInventoryListDto getInventory(EuInventoryListDto dto) {
		System.out.println(dto);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
		return service.getInvList(dto);
	}
	
	// 특정 품목의 사용 기록 조회
	@GetMapping("/inv/{pId}")
	public EuInventoryDetailListDto getInventoryDetail(@PathVariable(value="pId") int pId ,EuInventoryDetailListDto dto) {
		dto.setPId(pId);
		return service.getInvDetailList(dto);
	}
	
	// 입고 및 사용 내역 추가 (+,-)
	@PostMapping("/inv/add")
	public void addInventoryDetail(@RequestBody EuInventoryDetailDto dto) {
		System.out.println("입고 및 사용 내역 추가 (+,-");
		System.out.println(dto);
		service.addInvDetail(dto);
	}
	
	// 수정을 위해 해당 재고 기록 하나의 세부 내용 가져오기
	@GetMapping("/inv/detail/{invId}")
	public EuInventoryDetailDto getInventoryDetailOne(@PathVariable(value="invId") int invId) {
		return service.getInvDetailOne(invId);
	}
	
	// 입고 및 사용 내역 수정 (+,-)
	@PatchMapping("/inv/edit/{invId}")
	public void editInventoryDetail(@PathVariable(value="invId") int invId ,@RequestBody EuInventoryDetailDto dto) {
		dto.setInvId(invId);
		System.out.println("------------"+dto);
		service.editInvDetail(dto);
	}
	
	// 입고 및 사용 내역 삭제 
	@DeleteMapping("/inv/delete/{invId}")
	public void deleteInventoryDetail(@PathVariable(value="invId") int invId) {
		service.deleteInvDetail(invId);
	}
	
	// 품목 코드 입력했을 때 품목명 찾아오기
	@GetMapping("/inv/getPname/{pId}")
	public String getPnameToPid(@PathVariable(value="pId") int pId) {
		return service.getPnameToPid(pId);
	}
	
	// 품목명 입력 했을 때 품목 아이디 찾아오기
	@GetMapping("/inv/getPid/{pName}")
	public int getPidToPname(@PathVariable(value="pName") String pName) {
		return service.getPidToPname(pName);
	}
}


