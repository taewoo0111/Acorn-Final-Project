package com.example.FinalProject.service;

import java.util.List;

import com.example.FinalProject.dto.StudentClassHistoryDto;
import com.example.FinalProject.dto.StudentDto;
import com.example.FinalProject.dto.StudentListDto;
import com.example.FinalProject.dto.StudentSearchPageDto;

public interface StudentService {
	public int insertStudent(StudentDto dto);
	public int updateStudent(StudentDto dto);
	public List<StudentClassHistoryDto> getAllClasses(int studentId);
	public StudentListDto getResult(int pageNum, StudentSearchPageDto dto);
	public boolean isPhoneInUse(String phone);
}
