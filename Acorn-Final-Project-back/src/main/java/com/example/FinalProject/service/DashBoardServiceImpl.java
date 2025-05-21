package com.example.FinalProject.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FinalProject.mapper.DashBoardMapper;

@Service
public class DashBoardServiceImpl implements DashBoardService{

	@Autowired private DashBoardMapper dashBoardMapper;
	
	@Override
	public int getStudentsAll() {
		return dashBoardMapper.getStudentsAll();
	}

	@Override
	public int getUserAll() {
		return dashBoardMapper.getUserAll();
	}

	@Override
	public int getLastYearCeoOrderSale() {
		int lastYear = LocalDate.now().minusYears(1).getYear();
		return dashBoardMapper.getLastYearCeoOrderSale(lastYear);
	}

	@Override
	public List<Map<String, Object>> getLastYearMonthlySales() {
		int lastYear = LocalDate.now().minusYears(1).getYear();
		return dashBoardMapper.getLastYearMonthlySales(lastYear);
	}

	@Override
	public List<Map<String, Object>> getPopularLectureTop3() {
		return dashBoardMapper.getPopularLectureTop3();
	}
	
	

	@Override
	public int getStudentByUserId(int userId) {
		return dashBoardMapper.getStudentByUserId(userId);
	}

	@Override
	public int getTeacherByUserId(int userId) {
		return dashBoardMapper.getTeacherByUserId(userId);
	}

	@Override
	public int getClassByUserId(int userId) {
		return dashBoardMapper.getClassByUserId(userId);
	}

	@Override
	public List<Map<String, Object>> getLastMonthlySalesByUserId(int userId) {
		int lastYear = LocalDate.now().minusYears(1).getYear();
		return dashBoardMapper.getLastMonthlySalesByUserId(lastYear, userId);
	}

	@Override
	public List<Map<String, Object>> getPopularLectureTop3ByUserId(int userId) {
		return dashBoardMapper.getPopularLectureTop3ByUserId(userId);
	}

}
