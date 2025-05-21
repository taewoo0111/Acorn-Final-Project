package com.example.FinalProject.service;

import java.util.List;

import com.example.FinalProject.dto.HjClassDto;
import com.example.FinalProject.dto.HjClassListDto;
import com.example.FinalProject.dto.HjLectureDto;
import com.example.FinalProject.dto.SelectableStudentDto;
import com.example.FinalProject.dto.StudentDto;

public interface ClassService {
	public HjClassListDto getClassByStore(int pageNum, HjClassListDto search);
	public HjClassDto getClassDescription(int classId);
	public boolean addClass(HjClassDto dto);
	public boolean updateClass(HjClassDto dto);
	public boolean updateClassStatus(HjClassDto dto);
	public List<HjLectureDto> getClassLecture();
	public HjClassDto getClassdetail(int classId);
	
	public List<HjClassDto> getAllClassList(int userId);
	//
	public List<StudentDto> getClassStudentList(int classId);
	public List<StudentDto> getAllStudentList(int userId);
	
	List<SelectableStudentDto> checkStudentsWithConflict(int classId, int userId); // 중복 체크 가능한 학생 반환
	public void addStudentsToClass(int classId, List<Integer> studentIds); // 학생 수업 추가
	public void removeStudentFromClass(int classId, int studentId); // 학생 수업 삭제
}
