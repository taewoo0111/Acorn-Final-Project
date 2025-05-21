package com.example.FinalProject.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.TWCeoSaleDto;
import com.example.FinalProject.dto.TWCeoSalePageDto;
import com.example.FinalProject.service.CeoSaleService;

@RestController
public class CeoSaleController {
	
	@Autowired private CeoSaleService ceoSaleService;
	
	@GetMapping("/ceosale")
	public TWCeoSalePageDto getList(TWCeoSalePageDto dto) {
		return ceoSaleService.getList(dto);
	}
	
	@GetMapping("/ceosalegraph/{year}")
	public List<Map<String, Object>> getListGraph(@PathVariable int year){
		return ceoSaleService.getListGraph(year);
	}
	
	@GetMapping("/ceosalegraph/years")
	public List<Integer> getAvailableYears() {
	    return ceoSaleService.getAvailableYears();
	}
	
	@PostMapping("/ceosale") 
	public int insertEtcProfit(TWCeoSaleDto dto) {
		return ceoSaleService.insertEtcProfit(dto);
	}
	
	@PutMapping("/ceosale/{ceoSaleId}")
	public int update(TWCeoSaleDto dto) {
		return ceoSaleService.update(dto);
	}
	
	@PostMapping("/ceosaleself")
	public int insertEtcProfitSelf(TWCeoSaleDto dto) {
		return ceoSaleService.insertEtcProfitSelf(dto);
	}
	
	@GetMapping("/viewsale/{userId}/{year}")
	public List<Map<String, Object>> getListAdminSale(@PathVariable int userId, @PathVariable int year){
		return ceoSaleService.getListAdminSale(year, userId);
	}
	
	@GetMapping("viewyear/{userId}")
	public List<Integer> getViewAvailableYears(@PathVariable int userId){
		return ceoSaleService.getViewAvailableYears(userId);
	}
	
	 @GetMapping("/viewusers")
	 public List<Map<String, Object>> getUserList() {
	    return ceoSaleService.getUserList(); // user_id, user_name을 포함하는 리스트 반환
	 }
}
