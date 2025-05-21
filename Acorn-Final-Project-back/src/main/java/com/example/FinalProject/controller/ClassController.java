package com.example.FinalProject.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.HjClassDto;
import com.example.FinalProject.dto.HjClassListDto;
import com.example.FinalProject.dto.HjLectureDto;
import com.example.FinalProject.dto.SelectableStudentDto;
import com.example.FinalProject.dto.StudentDto;
import com.example.FinalProject.service.AdminSalesService;
import com.example.FinalProject.service.ClassService;
import com.example.FinalProject.service.ClassServiceImpl.SalesRegisterFailException;

@RestController
public class ClassController {
	@Autowired private ClassService service;
	@Autowired private AdminSalesService adminservice;
	
	// 테스트용
	@GetMapping("/class/ping")
	public String ping() {
		return "pong";
	}	
	
	// 해당지점 수업 리스트 불러오기
	@GetMapping("/class")
	public HjClassListDto getClassByStore(@RequestParam(defaultValue = "1") int pageNum, HjClassListDto search) {
		
		return service.getClassByStore(pageNum, search);
	}	
	
	// 수업 설명 불러오기
	@GetMapping("/class/description")
	public HjClassDto getClassDescription(int classId) {
		return service.getClassDescription(classId);
	}	
	
	//수업 상세내용 불러오기
	@GetMapping("/class/detail")
	public HjClassDto getClassdetail(int classId) {
		return service.getClassdetail(classId);
	}		
	
	// 해당지점 수업 개설하기
	@PostMapping("/class/add")
	public boolean addClass(@RequestBody HjClassDto dto) {
		return service.addClass(dto);
	};	

	//수업정보수정 
	@PatchMapping("/class/update")
	public boolean updateClass(@RequestBody HjClassDto dto) {
		return service.updateClass(dto);
	}
	
	//수업상태값 수정
	@PatchMapping("/class/status")
	public Map<String, Object> updateClassStatus(@RequestBody HjClassDto dto) {

		Map<String, Object> result = new HashMap<>();
		
	    try {
	    	boolean updateResult = service.updateClassStatus(dto);
	        result.put("success", updateResult);
	        
	        if (updateResult) {
	            result.put("message", "수업 상태변경에 성공하였습니다.");
	        } else {
	            result.put("message", "수업 상태변경에 실패하였습니다.");
	        }
	        
	        
	    } catch (SalesRegisterFailException e) {
	        result.put("success", false);
	        result.put("message",  e.getMessage());
	    }

	    return result;
	}
	
		
	
	// 수업 강의분류 가져오기
	@GetMapping("/class/lecture")
	public List<HjLectureDto> getClassLecture() {
		return service.getClassLecture();
	};	
	
	// 해당 지점 수업 전체 리스트(페이징, 검색 조건 처리 없이) 가져오기
	// class/calendar?userId=1
	@GetMapping("/class/calendar")
	public List<HjClassDto> getClassList(@RequestParam int userId){ 
		
		return service.getAllClassList(userId);
	}
	
	
	//class/student?classId=6
	// 해당 수업 학생 리스트 가져오기
	@GetMapping("/class/student")
	public List<StudentDto> getClassStudentList(int classId){
		return service.getClassStudentList(classId);
	}
	
	//class/all-student?userId=2
	// 해당 지점 학생 리스트 가져오기
	@GetMapping("/class/all-student")
	public List<StudentDto> getAllStudentList(int userId){
		return service.getAllStudentList(userId);
	}
	
	@GetMapping("/class/check-students")
	public ResponseEntity<List<SelectableStudentDto>> getSelectableStudents(
	        @RequestParam int classId,
	        @RequestParam int userId) {
	    List<SelectableStudentDto> students = service.checkStudentsWithConflict(classId, userId);
	    return ResponseEntity.ok(students);
	}

	 @PostMapping("/class/{classId}/students")
	    public ResponseEntity<Void> addStudentsToClass(@PathVariable int classId,
	        @RequestBody List<Integer> studentIds) {
		 	System.out.println(studentIds);
	        service.addStudentsToClass(classId, studentIds);
	        return ResponseEntity.ok().build();
	    }

	    @DeleteMapping("/class/{classId}/student/{studentId}")
	    public ResponseEntity<Void> removeStudentFromClass(
	       @PathVariable int classId,
	        @PathVariable int studentId) {
	        service.removeStudentFromClass(classId, studentId);
	        return ResponseEntity.ok().build();
	    }
}
