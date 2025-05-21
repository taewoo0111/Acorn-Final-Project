package com.example.FinalProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.FinalProject.dto.HjTeacherDto;
import com.example.FinalProject.dto.TeacherClassHistoryDto;
import com.example.FinalProject.dto.TeacherDto;
import com.example.FinalProject.dto.TeacherSearchPageDto;

@Mapper
public interface TeacherMapper {
	List<TeacherClassHistoryDto> getClassHistory(int teacherId); // 특정 강사의 전체 수업 이력 가져오는 메소드
	int insert(TeacherDto dto); // 강사 정보 등록 메소드
	int update(TeacherDto dto); // 강사 정보 수정 메소드
	List<TeacherDto> getResult(TeacherSearchPageDto dto); // 검색조건에 따른 강사 목록 가져오는 메소드
	int getCount(TeacherSearchPageDto dto); // 강사 수 리턴하는 메소드
	List<HjTeacherDto> getClassteacher(int userId); // 특정지점에 재직하고있는 강사리스트 가져오는 메소드
	int getPhoneCount(String phone); // 전화번호 중복 체크
}
