package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("StudentSearchRequestDto")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentSearchRequestDto {
	private int userId;
	// 검색 조건
	private String state; // STUDY, S_QUIT, WHOLE
	private String condition; // STUDENT, CLASS
	private String keyword;
	
}
