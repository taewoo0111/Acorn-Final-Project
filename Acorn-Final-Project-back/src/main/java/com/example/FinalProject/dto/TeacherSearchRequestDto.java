package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("TeacherSearchRequestDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TeacherSearchRequestDto {
	private int userId;
	// 검색 조건
	private String state; // WORK, T_QUIT, WHOLE
	private String condition; // TEACHER, CLASS
	private String keyword;
	
}
