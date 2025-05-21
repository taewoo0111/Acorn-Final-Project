package com.example.FinalProject.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("JsClsToProfitDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class JsClsToProfitDto {
	private int classId;
	private String className;
	private String cdLecture;
	private int userId;
	private String startDate;
	private String endDate;		
	private String weekday;	
	private int studentCount;
	private int price;
	private int profit;
	private String cdStatus;
	private String saleName;
}
