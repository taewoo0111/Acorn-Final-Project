package com.example.FinalProject.service;

import java.util.List;

import com.example.FinalProject.dto.HCCodeDto;

public interface CodeService {
	//acode 리스트
	public List<HCCodeDto> getAcodeList();
	//acode 등록
	public void saveAcode(HCCodeDto dto);
	//acode 삭제(리스트 미출력)
	public void hideAcode(String acode);
	
	//bcode 리스트
	public List<HCCodeDto> getBcodeList(String acode);
	//bcode 등록
	public void saveBcode(HCCodeDto dto);
	//bcode 삭제(리스트 미출력)
	public void hideBcode(String bcode);
}