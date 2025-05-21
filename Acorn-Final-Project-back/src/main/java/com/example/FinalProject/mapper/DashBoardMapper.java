package com.example.FinalProject.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface DashBoardMapper {
	
	// Ceo DashBoard
	int getStudentsAll();
	int getUserAll();
	int getLastYearCeoOrderSale(int lastyear);
	List<Map<String, Object>> getLastYearMonthlySales(int lastYear);
	List<Map<String, Object>> getPopularLectureTop3();
	
	// Admin DashBoard
	int getStudentByUserId(int userId);
	int getTeacherByUserId(int userId);
	int getClassByUserId(int userId);
	List<Map<String, Object>> getLastMonthlySalesByUserId(@Param("lastYear") int lastYear, @Param("userId") int userId);
	List<Map<String, Object>> getPopularLectureTop3ByUserId(int userId);
}
