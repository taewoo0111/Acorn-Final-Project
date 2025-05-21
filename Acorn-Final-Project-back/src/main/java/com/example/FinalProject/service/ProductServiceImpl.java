package com.example.FinalProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.HCProductDto;
import com.example.FinalProject.dto.HCProductListDto;
import com.example.FinalProject.mapper.ProductMapper;

@Service
public class ProductServiceImpl implements ProductService{

	//한 페이지에 몇개씩 표시할 것인지
	final int PAGE_ROW_COUNT=10;
	//하단 페이지를 몇개씩 표시할 것인지
	final int PAGE_DISPLAY_COUNT=5;
	
	@Autowired private ProductMapper mapper;
	
	@Override
	public HCProductListDto getList(int pageNum, HCProductDto search) {
		//보여줄 페이지의 시작 ROWNUM
		int startRowNum=1+(pageNum-1)*PAGE_ROW_COUNT;
		//보여줄 페이지의 끝 ROWNUM
		int endRowNum=pageNum*PAGE_ROW_COUNT;
				
		//하단 시작 페이지 번호 
		int startPageNum = 1 + ((pageNum-1)/PAGE_DISPLAY_COUNT)*PAGE_DISPLAY_COUNT;
		//하단 끝 페이지 번호
		int endPageNum=startPageNum+PAGE_DISPLAY_COUNT-1;
		//전체 글의 갯수
		int totalRow=mapper.getProductCount(search);
		//전체 페이지의 갯수 구하기
		int totalPageCount=(int)Math.ceil(totalRow/(double)PAGE_ROW_COUNT);
		//끝 페이지 번호가 이미 전체 페이지 갯수보다 크게 계산되었다면 잘못된 값이다.
		if(endPageNum > totalPageCount){
			endPageNum=totalPageCount; //보정해 준다. 
		}
		
		// startRowNum 과 endRowNum 을 PostDto 객체에 담아서
		search.setStartRowNum(startRowNum);
		search.setEndRowNum(endRowNum);
		
		//글 목록 얻어오기
		List<HCProductDto> list = mapper.getProductList(search);
		
		String findQuery="";
		if(search.getKeyword() != null) {
			findQuery = "&keyword="+search.getKeyword()+"&cdCategory="+search.getCdCategory();
		}
		HCProductListDto dto = HCProductListDto.builder()
							.list(list)
							.startPageNum(startPageNum)
							.endPageNum(endPageNum)
							.totalPageCount(totalPageCount)
							.totalRow(totalRow)
							.findQuery(findQuery)
							.pageNum(pageNum)
							.cdCategory(search.getCdCategory())
							.keyword(search.getKeyword())
							.build();
		
		return dto;
	}

	@Override
	public void insertProduct(HCProductDto dto) {
		mapper.insertProduct(dto);
	}

	@Override
	public void updateProduct(HCProductDto dto) {
		mapper.updateProduct(dto);
	}

	@Override
	public void hideProduct(int productId) {
		mapper.hideProduct(productId);
	}

	@Override
	public int getCount(HCProductDto search) {
		
		return mapper.getProductCount(search);
	}

	@Override
	public HCProductDto getData(int productId) {
		return mapper.getData(productId);
	}
	
}

