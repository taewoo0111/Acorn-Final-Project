package com.example.FinalProject.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("StudentListDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentListDto {
	private List<StudentDto> list;
	private int startPageNum;
	private int endPageNum;
	private int totalPageCount;
	private int pageNum;
	private int totalRow;

	private String state;
	private String condition;
	private String keyword;

}
