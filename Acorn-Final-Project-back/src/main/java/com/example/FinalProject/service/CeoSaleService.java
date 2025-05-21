package com.example.FinalProject.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.example.FinalProject.dto.TWCeoSaleDto;
import com.example.FinalProject.dto.TWCeoSalePageDto;

public interface CeoSaleService {
	int insertEtcProfit(TWCeoSaleDto ceoSaleDto);
	int insertEtcProfitSelf(TWCeoSaleDto ceoSaleDto);
	int update(TWCeoSaleDto ceoSaleDto);
	TWCeoSalePageDto getList(TWCeoSalePageDto dto);
	int getTotalRow();
	List<Map<String, Object>> getListGraph(int year);
	List<Integer> getAvailableYears();
	
	 List<Map<String, Object>> getListAdminSale(@Param("year") int year, @Param("userId") int userId);
	 List<Integer> getViewAvailableYears(int userId);
	 List<Map<String, Object>> getUserList();
}
