package com.example.FinalProject.repository;

import com.example.FinalProject.dto.UserDto;

public interface UserDao {
	public UserDto getData(long num);
	public UserDto getData(String userName);
	public int insert(UserDto dto);
	public int updatePassword(UserDto dto);
	public int update(UserDto dto);
}
