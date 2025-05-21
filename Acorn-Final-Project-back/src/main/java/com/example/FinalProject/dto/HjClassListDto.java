package com.example.FinalProject.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("HjClassListDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class HjClassListDto {
	private List<HjClassDto> list;
	//검색조건
	private String userId;
	private String cdStatus;
	private String condition; //검색 조건 teacherName or className
	private String keyword; //검색 키워드
	
	//페이징처리
	private int startRowNum; //rownum
	private int endRowNum;	//rownum
	private int pageNum; //현재페이지번호
	private int totalRow; //전체 게시글 수 
	private int totalPageCount; //전체 페이지 수 (totalRow / 페이지당 개수)
	private int startPageNum; //시작 페이지번호
	private int endPageNum; //끝 페이지번호
	private String findQuery; //임시
}
