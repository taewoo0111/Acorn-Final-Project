package com.example.FinalProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.FinalProject.dto.StudentClassHistoryDto;
import com.example.FinalProject.dto.StudentDto;
import com.example.FinalProject.dto.StudentSearchPageDto;

@Mapper
public interface StudentMapper {
	List<StudentClassHistoryDto> getClassHistory(int studentId); // 특정 학생의 전체 수강 이력 가져오는 메소드
	int insert(StudentDto dto); // 학생 정보 등록 메소드
	int update(StudentDto dto); // 학생 정보 수정 메소드
	List<StudentDto> getResult(StudentSearchPageDto dto); // 검색조건에 따른 학생 목록 가져오는 메소드
	int getCount(StudentSearchPageDto dto); // 학생 수 리턴하는 메소드
	int getPhoneCount(String phone); // 전화번호 중복 체크
}
