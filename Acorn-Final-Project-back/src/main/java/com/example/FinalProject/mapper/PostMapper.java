package com.example.FinalProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.FinalProject.dto.HCPostDto;

@Mapper
public interface PostMapper {
	//공지 리스트
	public List<HCPostDto> getPostList(HCPostDto dto);
    //공지 행 갯수(검색 페이징용)
    public int getPostCount(HCPostDto dto);
    //상세보기
    public HCPostDto getPostData(@Param("postId") int postId);
    //공지 등록
    public int insertPost(HCPostDto dto);
    //공지 수정
    public int updatePost(HCPostDto dto);
    //공지 삭제
    public int deletePost(@Param("postId") int postId);
}
