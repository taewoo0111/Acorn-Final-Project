package com.example.FinalProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.FinalProject.dto.HCProductDto;

@Mapper
public interface ProductMapper {
	//품목 리스트
	public List<HCProductDto> getProductList(HCProductDto search);
    //리스트 행 개수(검색 페이징용)
	public int getProductCount(HCProductDto search);
    //품목 등록
	public int insertProduct(HCProductDto product);
    //품목 가격 수정
	public int updateProduct(HCProductDto product);
    //품목 삭제(상태값 변화로 인한 리스트 미출력)
	public int hideProduct(@Param("productId") int productId);
    //품목 보기(수정 위해 값 불러오기)
    public HCProductDto getData(@Param("productId") int productId);
}

