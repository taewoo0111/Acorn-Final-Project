package com.example.FinalProject.service;
 
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.LoginDto; 
 
@Service
public interface LoginService {
	// 로그인 서비스
	public LoginDto login(LoginDto login);
}