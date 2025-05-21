package com.example.FinalProject.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;


public interface DashBoardService {
	
	// Ceo DashBoard
	int getStudentsAll();
	int getUserAll();
	int getLastYearCeoOrderSale();
	List<Map<String, Object>> getLastYearMonthlySales();
	List<Map<String, Object>> getPopularLectureTop3();
	
	// Admin DashBoard
	int getStudentByUserId(int userId);
	int getTeacherByUserId(int userId);
	int getClassByUserId(int userId);
	List<Map<String, Object>> getLastMonthlySalesByUserId(@Param("userId") int userId);
	List<Map<String, Object>> getPopularLectureTop3ByUserId(int userId);
}
