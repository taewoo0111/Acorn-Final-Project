package com.example.FinalProject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.LoginDto;
import com.example.FinalProject.service.LoginService;

@RestController
public class LoginController {
	@Autowired private LoginService loginService;

	//품목 리스트
	@PostMapping("/login")
	public LoginDto list(@RequestBody LoginDto loginDto) {
	    return loginService.login(loginDto);
	}
}
