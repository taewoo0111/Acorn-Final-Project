package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("commentDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CommentDto {
	private long num;
	private String writer;
	private String content;
	private String targetWriter;	//댓글 대상자의 아이디
	private long postNum;	//원글의 글번호
	private long parentNum;	//댓글의 그룹번호
	private String deleted;
	private String createdAt;
	private String profileImage;
	//페이징 처리를 위한 필드
	private int startRowNum;
	private int endRowNum;
}
