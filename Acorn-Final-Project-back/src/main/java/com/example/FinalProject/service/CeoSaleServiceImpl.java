package com.example.FinalProject.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.TWCeoSaleDto;
import com.example.FinalProject.dto.TWCeoSalePageDto;
import com.example.FinalProject.mapper.CeoSaleMapper;

@Service
public class CeoSaleServiceImpl implements CeoSaleService{
	
	@Autowired private CeoSaleMapper ceoSaleMapper;

	@Override
	public int insertEtcProfit(TWCeoSaleDto ceoSaleDto) {
		return ceoSaleMapper.insertEtcProfit(ceoSaleDto);
	}

	@Override
	public int insertEtcProfitSelf(TWCeoSaleDto ceoSaleDto) {
		return ceoSaleMapper.insertEtcProfitSelf(ceoSaleDto);
	}

	@Override
	public TWCeoSalePageDto getList(TWCeoSalePageDto dto) {
	    int pageNum = dto.getPageNum();
	    int totalRow = ceoSaleMapper.getTotalRow();
	    
	    int rowPerPage = 10;
	    int pageCountPerGroup = 5;
	    int startRowNum = (pageNum - 1) * rowPerPage + 1;
	    int endRowNum = pageNum * rowPerPage;
	    int totalPageCount = (int) Math.ceil((double) totalRow / rowPerPage);
	    int currentGroup = (int) Math.ceil((double) pageNum / pageCountPerGroup);
	    int startPageNum = (currentGroup - 1) * pageCountPerGroup + 1;
	    int endPageNum = Math.min(startPageNum + pageCountPerGroup - 1, totalPageCount);
	    
	    // 새로운 DTO 생성 및 페이지네이션 정보 설정
	    TWCeoSalePageDto resultDto = new TWCeoSalePageDto();
	    resultDto.setPageNum(pageNum);
	    resultDto.setStartRowNum(startRowNum);
	    resultDto.setEndRowNum(endRowNum);
	    resultDto.setTotalRow(totalRow);
	    resultDto.setTotalPageCount(totalPageCount);
	    resultDto.setStartPageNum(startPageNum);
	    resultDto.setEndPageNum(endPageNum);
	    
	    // 페이지네이션 정보가 설정된 DTO로 데이터 조회
	    List<TWCeoSaleDto> content = ceoSaleMapper.getList(resultDto);
	    resultDto.setContent(content);
	    
	    return resultDto;
	}

	@Override
	public int update(TWCeoSaleDto ceoSaleDto) {
		return ceoSaleMapper.update(ceoSaleDto);
	}

	@Override
	public int getTotalRow() {
		return ceoSaleMapper.getTotalRow();
	}

	@Override
	public List<Map<String, Object>> getListGraph(int year) {
		return ceoSaleMapper.getListGraph(year);
	}

	@Override
	public List<Integer> getAvailableYears() {
		return ceoSaleMapper.getAvailableYears();
	}

	@Override
	public List<Map<String, Object>> getListAdminSale(int year, int userId) {
		return ceoSaleMapper.getListAdminSale(year, userId);
	}

	@Override
	public List<Integer> getViewAvailableYears(int userId) {
		return ceoSaleMapper.getViewAvailableYears(userId);
	}

	@Override
	public List<Map<String, Object>> getUserList() {
		return ceoSaleMapper.getUserList();
	}

}
