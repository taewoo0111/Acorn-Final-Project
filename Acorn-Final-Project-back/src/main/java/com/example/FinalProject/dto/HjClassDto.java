package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("HjClassDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class HjClassDto {
	private int classId;
	private String className;
	private String cdLecture;
	private int userId;
	private int teacherId;
	private String teacherName;
	private String startDate;
	private String endDate;	
	private String startTime;	
	private String endTime;	
	private String weekday;	
	private int currentStudent;
	private int maxStudent;
	private int price;
	private String applyStartDate;
	private String applyEndDate;
	private String cdStatus;
	private String description;
}
