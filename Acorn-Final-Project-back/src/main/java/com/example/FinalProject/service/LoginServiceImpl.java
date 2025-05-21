package com.example.FinalProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.HCCodeDto;
import com.example.FinalProject.dto.LoginDto;
import com.example.FinalProject.mapper.CodeMapper;
import com.example.FinalProject.mapper.LoginMapper;

@Service
public class LoginServiceImpl implements LoginService{
	
	@Autowired private LoginMapper mapper;
	
	@Override
	public LoginDto login(LoginDto loginDto) {
		List<LoginDto> userList = mapper.login(loginDto);
		
		if(userList.size() != 1)
			return null;
		else
			return userList.get(0);
	}
  
}
