package com.example.FinalProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.FinalProject.dto.HjClassDto;
import com.example.FinalProject.dto.HjClassListDto;
import com.example.FinalProject.dto.HjLectureDto;
import com.example.FinalProject.dto.StudentClassDto;
import com.example.FinalProject.dto.StudentDto;
import com.example.FinalProject.dto.ClassCheckDto;
import com.example.FinalProject.dto.ConflictClassDto;
import com.example.FinalProject.dto.HCPostDto;

@Mapper
public interface ClassMapper {
	List<HjClassDto> getClassByStore(HjClassListDto dto);
	int getCount(HjClassListDto dto);
	HjClassDto getClassDescription(int classId);
	boolean addClass(HjClassDto dto);
	boolean updateClass(HjClassDto dto);
	boolean updateClassStatus(HjClassDto dto);
	List<HjLectureDto> getClassLecture();
	HjClassDto getClassdetail(int classId);
	
	List<HjClassDto> getClassList(int userId);
	
	List<StudentDto> getClassStudentList(int classId);
	List<StudentDto> getAllStudentList(int userId);
    List<ConflictClassDto> getStudentSchedules(@Param("studentId") int studentId,
            @Param("classId") int classId);
    void insertStudentClass(@Param("classId") int classId, @Param("studentIds") List<Integer> studentIds);
    void deleteStudentClass(@Param("classId") int classId, @Param("studentId") int studentId);
	
}
