package com.example.FinalProject.service;

import com.example.FinalProject.dto.UserDto;

public interface UserService {
	public UserDto getByNum(long num);
	public UserDto getByUserName(String userName);
	public void createUser(UserDto dto);
	public void updateUserInfo(UserDto dto);
	public void changePassword(UserDto dto); 
}
