package com.example.FinalProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.FinalProject.dto.HCStoreDto;

@Mapper
public interface StoreMapper {
	//지점 리스트
	public List<HCStoreDto> getStoreList(HCStoreDto dto);
	//리스트 검색+페이징용 
	public int getStoreCount(HCStoreDto dto);
	//지점 추가
	public int insertStore(HCStoreDto dto);
	//지점 보기(수정 위해 값 불러오기)
	public HCStoreDto getStoreDetail(@Param("userId") int userId);
	//지점 수정
	public int updateStore(HCStoreDto dto);
	//지점 삭제(상태값 변화로 인한 리스트 미출력)
	public int deleteStore(@Param("userId") int userId);
	//삭제처리 위한 본사 암호 입력
	public String getAdminPwdById(@Param("id") int id);
}
