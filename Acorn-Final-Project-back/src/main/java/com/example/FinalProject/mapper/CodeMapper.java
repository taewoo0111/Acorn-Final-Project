package com.example.FinalProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.FinalProject.dto.HCCodeDto;

@Mapper
public interface CodeMapper {
	//기본 Acode 리스트
	public List<HCCodeDto> getAcodeList();
	//Acode 등록
	public int insertAcode(HCCodeDto dto);
	//Acode 삭제(상태값 변화로 인한 리스트 미출력)
	public int hideAcode(@Param("acode") String acode);
	
	//Acode 에 맞는 Bcode 리스트
	public List<HCCodeDto> getBcodeList(HCCodeDto dto);
	//Bcode 등록
	public int insertBcode(HCCodeDto dto);
	//Bcode 삭제(상태값 변화로 인한 리스트 미출력)
	public int hideBcode(@Param("bcode") String bcode);
}