package com.example.FinalProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.HCCodeDto;
import com.example.FinalProject.mapper.CodeMapper;

@Service
public class CodeServiceImpl implements CodeService{
	
	@Autowired private CodeMapper mapper;
	
	@Override
	public List<HCCodeDto> getAcodeList() {
		return mapper.getAcodeList();
	}

	@Override
	public void saveAcode(HCCodeDto dto) {
		mapper.insertAcode(dto);
	}

	@Override
	public void hideAcode(String acode) {
		mapper.hideAcode(acode);
	}

	@Override
	public List<HCCodeDto> getBcodeList(String acode) {
		HCCodeDto dto = new HCCodeDto();
        dto.setAcode(acode);
		return mapper.getBcodeList(dto);
	}

	@Override
	public void saveBcode(HCCodeDto dto) {
		System.out.println(dto);
		mapper.insertBcode(dto);
	}

	@Override
	public void hideBcode(String bcode) {
		mapper.hideBcode(bcode);
	}

}
