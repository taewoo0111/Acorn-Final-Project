package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("TeacherClassHistoryDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TeacherClassHistoryDto {
	private int teacherId;
	private String name;
	// 수업 이력 정보
	private int classId;
	private String className;
	private String startDate;
	private String endDate;
	private String startTime;
	private String endTime;
	private int currentStudent;
	private int maxStudent;
	private String weekday;
}
