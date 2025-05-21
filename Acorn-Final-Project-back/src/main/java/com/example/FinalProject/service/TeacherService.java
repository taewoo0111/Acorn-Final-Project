package com.example.FinalProject.service;

import java.util.List;

import com.example.FinalProject.dto.HjTeacherDto;
import com.example.FinalProject.dto.TeacherClassHistoryDto;
import com.example.FinalProject.dto.TeacherDto;
import com.example.FinalProject.dto.TeacherListDto;
import com.example.FinalProject.dto.TeacherSearchPageDto;

public interface TeacherService {
	public int insertTeacher(TeacherDto dto);
	public int updateTeacher(TeacherDto dto);
	public List<TeacherClassHistoryDto> getAllClasses(int teacherId);
	public TeacherListDto getResult(int pageNum, TeacherSearchPageDto dto);
	public List<HjTeacherDto> getClassteacher(int userId);
	public boolean isPhoneInUse(String phone);
}
