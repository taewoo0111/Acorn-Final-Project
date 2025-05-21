package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("PostDto") 
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class HCPostDto {
	private int postId;
	private String title;
	private String writer;
	private String content;
	private String creDate;
	private String editDate;
	private String uploadFile;
	
	private int startRowNum;
	private int endRowNum;
	private String condition; 
	private String keyword; 
}
