package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("StudentPageRequestDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentPageRequestDto {
	private int startRowNum;
	private int endRowNum;
	
	private int startPageNum;
	private int endPageNum;
	
	private int totalPageCount;
	private int pageNum;
	private int totalRow;
/*
	private String state;
	private String condition;
	private String keyword;
	private String findQuery;
	*/
}
