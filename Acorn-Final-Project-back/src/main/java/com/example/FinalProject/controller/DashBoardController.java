package com.example.FinalProject.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.service.DashBoardService;

@RestController
public class DashBoardController {
	
	@Autowired private DashBoardService dashBoardService;
	
	@GetMapping("/ceo/overview/students")
	public int getStudentsAll() {
		return dashBoardService.getStudentsAll();
	}
	
	@GetMapping("/ceo/overview/users")
	public int getUserAll() {
		return dashBoardService.getUserAll()-1;
	}
	
	@GetMapping("/ceo/overview/ceosale")
	public int getLastYearCeoOrderSale() {
		return dashBoardService.getLastYearCeoOrderSale();
	}
	
	@GetMapping("/ceo/overview/lastyearsale")
	public List<Map<String, Object>> getLastYearMonthlySales(){
		return dashBoardService.getLastYearMonthlySales();
	}
	
	@GetMapping("/ceo/overview/popularlecture")
	public List<Map<String, Object>> getPopularLectureTop3(){
		return dashBoardService.getPopularLectureTop3();
	}
	
	
	
	@GetMapping("/admin/overview/students")
	public int getStudentByUserId(@RequestParam Integer userId) {
		return dashBoardService.getStudentByUserId(userId);
	}
	
	@GetMapping("/admin/overview/teachers")
	public int getTeacherByUserId(@RequestParam Integer userId) {
		return dashBoardService.getTeacherByUserId(userId);
	}
	
	@GetMapping("/admin/overview/class")
	public int getClassByUserId(@RequestParam Integer userId) {
		return dashBoardService.getClassByUserId(userId);
	}
	
	@GetMapping("/admin/overview/lastyearsale/{userId}")
	public List<Map<String, Object>> getLastMonthlySalesByUserId(@PathVariable Integer userId){
		return dashBoardService.getLastMonthlySalesByUserId(userId);
	}
	
	@GetMapping("/admin/overview/popularlecture")
	public List<Map<String, Object>> getPopularLectureTop3ByUserId(@RequestParam Integer userId){
		return dashBoardService.getPopularLectureTop3ByUserId(userId);
	}
}
