package com.example.FinalProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper; 
 
import com.example.FinalProject.dto.LoginDto; 

@Mapper
public interface LoginMapper {
	List<LoginDto> login(LoginDto dto);

	
}
