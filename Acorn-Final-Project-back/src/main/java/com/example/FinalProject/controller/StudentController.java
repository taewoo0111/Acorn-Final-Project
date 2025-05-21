package com.example.FinalProject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.StudentClassHistoryDto;
import com.example.FinalProject.dto.StudentDto;
import com.example.FinalProject.dto.StudentListDto;
import com.example.FinalProject.dto.StudentSearchPageDto;
import com.example.FinalProject.dto.StudentSearchRequestDto;
import com.example.FinalProject.service.StudentService;

@RestController
public class StudentController {
	
	@Autowired StudentService studentService;
	
	// 테스트용
	@GetMapping("/students/ping")
	public String ping() {
		return "pong";
	}

	// students
	@PostMapping("/students")
	public String insertStudent(@RequestBody StudentDto dto) {
		studentService.insertStudent(dto);
		return "success!";
	}
	
	// students/1
	@PatchMapping("/students/{studentId}")
	public String updateStudent(@PathVariable int studentId, @RequestBody StudentDto dto) { //전달되는 studentId 를 studentId 로 StudentDto 에 사용
		dto.setStudentId(studentId);
		studentService.updateStudent(dto);
		return "success!";
	}

	// students/class?studentId=1
	@GetMapping("/students/class")
	public List<StudentClassHistoryDto> getAllClasses(@RequestParam int studentId){
		return studentService.getAllClasses(studentId);
	}
	
	// students?userId=01&state=STUDY&condition=STUDENT&keyword=%EA%B9%80%EC%B2%A0%EC%88%98
	/*
	 * 	특정 지점에 해당하는 userId 전달
	 * 	pageNum 이 파라미터로 넘어오지 않으면 pageNum 의 default 값은 1로 설정
	 * 	state 는 "STUDY", "S_QUIT", "WHOLE" 중 하나
	 * 	condition 과 keyword 는 검색 조건으로 넘어오는 값이 없으면 null
	 */
	@GetMapping("/students")
	public StudentListDto getResult(@RequestParam int userId,
			@RequestParam(defaultValue = "1") int pageNum,
			@RequestParam(defaultValue = "WHOLE") String state,
		    @RequestParam(required = false) String condition,
		    @RequestParam(required = false) String keyword){
		StudentSearchPageDto dto = new StudentSearchPageDto(); // 파라미터로 넘어오는 값을 모두 dto 에 담기
		StudentSearchRequestDto search = new StudentSearchRequestDto(userId, state, condition, keyword);
		dto.setSearch(search);
		return studentService.getResult(pageNum, dto);
	}
	
	/*
	ResponseEntity<T>는 Spring MVC에서 HTTP 응답(Response)을 직접 구성하여 API 응답을 세밀하게 제어 가능
	*/
	// students/phone-check?phone=010-1111-1111
	@GetMapping("/students/phone-check")
	    public ResponseEntity<Boolean> checkPhoneValidation(@RequestParam String phone) {
	        boolean isInvalid = studentService.isPhoneInUse(phone);
	        return ResponseEntity.ok(isInvalid); // true면 중복, false면 사용 가능
	    }
}