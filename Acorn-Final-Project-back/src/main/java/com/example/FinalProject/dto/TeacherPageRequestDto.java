package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("TeacherPageRequestDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TeacherPageRequestDto {
	// 페이징 처리
	private int startRowNum;
	private int endRowNum;
	
	private int startPageNum;
	private int endPageNum;
	
	private int totalPageCount;
	private int pageNum;
	private int totalRow;
}
