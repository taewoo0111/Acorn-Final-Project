package com.example.FinalProject.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.JsAdminSalesDto;
import com.example.FinalProject.dto.JsAdminSalesStatDto;
import com.example.FinalProject.service.AdminSalesService;
@RestController
public class AdminSalesController {
	@Autowired AdminSalesService salesservice;
	
	//매출 내용 가져오기(조건별 검색)
	@GetMapping("/sales")
	public JsAdminSalesDto getSalesList(
			@RequestParam(required = false) Integer userId,
		    @RequestParam(required = false) List<String> checkedItems,
		    @RequestParam(required = false, defaultValue="1") int pageNum
		    ) {

		return salesservice.getAdminSalesList(pageNum, userId, checkedItems);
	}
	
	//매출 내용 추가하기
	@PostMapping("/sales")
	public Map<String, Object> addSale(@RequestBody JsAdminSalesDto dto){
		int num=salesservice.addAdminSale(dto);
		return Map.of("num", num);
	}
	//매출 내용 수정하기
	@PutMapping("/sales/{adminSaleId}")
	public Map<String, Object> editSale(@PathVariable(name="adminSaleId") int adminSaleId, @RequestBody JsAdminSalesDto dto){
		int num=salesservice.editAdminSale(dto);
		return Map.of("num",num);
	}
	//매출 내용 삭제하기
	@DeleteMapping("/sales/{adminSaleId}")
	public Map<String, Object> deleteSale(@PathVariable(name="adminSaleId") int adminSaleId){
		int num = salesservice.deleteAdminSale(adminSaleId);
		return Map.of("num", num);
	}
	
	//연도별 월 매출/지출
	@GetMapping("/sales/YearlySale/{sYear}")
	public ResponseEntity<JsAdminSalesStatDto> getYearlySaleStat(
	    @PathVariable(name="sYear") String sYear,
	    @RequestParam(name = "userId", required = false, defaultValue = "1") Integer userId
	) {
		JsAdminSalesStatDto stat = salesservice.getYearlySalesStat(sYear, userId);
	    System.out.println(stat);
	    return ResponseEntity.ok(stat);
	}
	//연도의 과목별 매출, 그 연도의 특정월의 과목별 매출
	@GetMapping("/sales/LectureSale/{sYear}")
	public ResponseEntity<JsAdminSalesStatDto> getMonthlySaleStat(
			@PathVariable(name="sYear") String sYear,
			@RequestParam(name="sMonth", required = false, defaultValue = "1") String sMonth,
	        @RequestParam(name = "userId", required = false, defaultValue = "1") Integer userId) {
		JsAdminSalesStatDto result = salesservice.getSalesStatsByLecture(sYear, sMonth, userId);
	    System.out.println(result);
	    return ResponseEntity.ok(result);
	}
	
	
}
