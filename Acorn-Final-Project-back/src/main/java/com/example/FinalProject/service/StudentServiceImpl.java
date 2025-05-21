package com.example.FinalProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.StudentClassHistoryDto;
import com.example.FinalProject.dto.StudentDto;
import com.example.FinalProject.dto.StudentListDto;
import com.example.FinalProject.dto.StudentPageRequestDto;
import com.example.FinalProject.dto.StudentSearchPageDto;
import com.example.FinalProject.mapper.StudentMapper;

@Service
public class StudentServiceImpl implements StudentService{
	
	@Autowired StudentMapper studentMapper;
	

	@Override
	public int insertStudent(StudentDto dto) {
		// TODO Auto-generated method stub
		return studentMapper.insert(dto);
	}

	@Override
	public int updateStudent(StudentDto dto) {
		// TODO Auto-generated method stub
		return studentMapper.update(dto);
	}

	@Override
	public List<StudentClassHistoryDto> getAllClasses(int studentId) {
		// TODO Auto-generated method stub
		return studentMapper.getClassHistory(studentId);
	}

	/*
	 * 	pageNum 과 status, condition, keyword 가 담겨 있는 StudentSearchPageDto 를 전달하면
	 * 	해당 학생 목록을 리턴하는 메소드
	 */
	@Override
	public StudentListDto getResult(int pageNum, StudentSearchPageDto dto) {
		// TODO Auto-generated method stub

		//한 페이지에 몇개씩 표시할 것인지
		final int PAGE_ROW_COUNT=10;
		//하단 페이지를 몇개씩 표시할 것인지
		final int PAGE_DISPLAY_COUNT=5;
		//보여줄 페이지의 시작 ROWNUM
		int startRowNum=1+(pageNum-1)*PAGE_ROW_COUNT;
		//보여줄 페이지의 끝 ROWNUM
		int endRowNum=pageNum*PAGE_ROW_COUNT;
		
		//하단 시작 페이지 번호 
		int startPageNum = 1 + ((pageNum-1)/PAGE_DISPLAY_COUNT)*PAGE_DISPLAY_COUNT;
		//하단 끝 페이지 번호
		int endPageNum=startPageNum+PAGE_DISPLAY_COUNT-1;
		//전체 학생 수
		int totalRow=studentMapper.getCount(dto);
		//전체 페이지의 갯수 구하기
		int totalPageCount=(int)Math.ceil(totalRow/(double)PAGE_ROW_COUNT);
		//끝 페이지 번호가 이미 전체 페이지 갯수보다 크게 계산되었다면 잘못된 값이다.
		if(endPageNum > totalPageCount){
			endPageNum=totalPageCount; //보정해 준다. 
		}
		
		// startRowNum 과 endRowNum 을 StudentSearchPageDto 에 담기 위해 StudentPageRequestDto 에 먼저 담는다. 
		StudentPageRequestDto page = new StudentPageRequestDto();
		page.setStartRowNum(startRowNum);
		page.setEndRowNum(endRowNum);
		dto.setPage(page);

		//학생 목록 얻어오기
		List<StudentDto> list=studentMapper.getResult(dto);

		//학생 목록 페이지에서 필요한 정보를 모두 StudentListDto 에 담는다.
		StudentListDto resultDto=StudentListDto.builder()
				.list(list)
				.startPageNum(startPageNum)
				.endPageNum(endPageNum)
				.totalPageCount(totalPageCount)
				.pageNum(pageNum)
				.totalRow(totalRow)
				.state(dto.getSearch().getState())
				.condition(dto.getSearch().getCondition())
				.keyword(dto.getSearch().getKeyword())
				.build();
		
		return resultDto;
		
	}
	
  	@Override
  	public boolean isPhoneInUse(String phone){
  		return studentMapper.getPhoneCount(phone) > 0;
  
  	}
		
	


}