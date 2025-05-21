package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("StudentClassHistoryDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentClassHistoryDto {
	private int studentId;
	private String name;
	// 수업 이력 정보
	private int classId;
	private String className;
	private int teacherId;
	private String teacherName;
	private String startDate;
	private String endDate;
	private String startTime;
	private String endTime;
	private String weekday;
}
