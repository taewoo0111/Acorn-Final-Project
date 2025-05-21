package com.example.FinalProject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.HCCodeDto;
import com.example.FinalProject.service.CodeService;

@RestController 
public class CodeController {

	@Autowired private CodeService service;
	
	@GetMapping("/acode")
	public List<HCCodeDto> list(){
		return service.getAcodeList();
	}
	
	@PostMapping("/acode")
    public void insertAcode(@RequestBody HCCodeDto dto) {
        service.saveAcode(dto);
    }

    // A코드 숨기기
    @PatchMapping("/acode/{acode}")
    public void hideAcode(@PathVariable String acode) {
        service.hideAcode(acode);
    }

    // B코드 리스트
    @GetMapping("/bcode/{acode}")
    public List<HCCodeDto> getBcodeList(@PathVariable String acode) {
        return service.getBcodeList(acode);
    }

    // B코드 등록
    @PostMapping("/bcode")
    public void insertBcode(@RequestBody HCCodeDto dto) {
    	
        service.saveBcode(dto);
    }

    // B코드 숨기기
    @PatchMapping("/bcode/{bcode}")
    public void hideBcode(@PathVariable String bcode) {
        service.hideBcode(bcode);
    }
}