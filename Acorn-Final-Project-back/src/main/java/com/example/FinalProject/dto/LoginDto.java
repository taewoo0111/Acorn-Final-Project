package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("loginDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginDto {
	private String id;
	private String pw; 

	
	private Integer userId;
	private String userName;
	private String storeName;
	private String cdRole;
}
