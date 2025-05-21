package com.example.FinalProject.service;

import com.example.FinalProject.dto.HCProductDto;
import com.example.FinalProject.dto.HCProductListDto;

public interface ProductService {
	//품목 리스트
	public HCProductListDto getList(int pageNum, HCProductDto search);
	//풒목 수
	public int getCount(HCProductDto search);
	//품목 보기
	public HCProductDto getData(int productId);
	//품목 추가
	public void insertProduct(HCProductDto dto);
	//품목 수정
	public void updateProduct(HCProductDto dto);
	//품목 삭제(품목 리스트 미출력)
	public void hideProduct(int productId);
}
