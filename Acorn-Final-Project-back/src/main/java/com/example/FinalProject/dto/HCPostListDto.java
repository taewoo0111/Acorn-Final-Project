package com.example.FinalProject.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class HCPostListDto {
	private List<HCPostDto> list;
	private int startPageNum;
	private int endPageNum;
	private int totalPageCount;
	private int pageNum;
	private int totalRow;
	private String findQuery;
	private String condition;
	private String keyword;
}
