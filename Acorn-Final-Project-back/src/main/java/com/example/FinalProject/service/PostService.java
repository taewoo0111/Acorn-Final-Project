package com.example.FinalProject.service;

import com.example.FinalProject.dto.HCPostDto;
import com.example.FinalProject.dto.HCPostListDto;

public interface PostService {
	//공지 리스트
	public HCPostListDto getlist(int pageNum, HCPostDto search);
	//공지 등록
	public int insertPost(HCPostDto dto);
	//공지 보기
	public HCPostDto getPostData(int postId);
	//공지 수정
	public void updatePost(HCPostDto dto);
	//공지 삭제
	public void deletePost(int postId);
}