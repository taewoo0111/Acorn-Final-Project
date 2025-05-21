package com.example.FinalProject.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("JsAdminSalesStatDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class JsAdminSalesStatDto {
	private Integer userId;
	private String sMonth;//상동  
	private String sYear;//상동
	private List<JsAdminSalesStatDto> sMonthList;
	private List<JsAdminSalesStatDto> sYearList;
	private List<JsAdminSalesStatDto> profitList;
	private List<JsAdminSalesStatDto> costList;
	private JsAdminSalesStatDto search;
	private long price;
	private List<JsAdminSalesStatDto> LectSaleYearly;
    private List<JsAdminSalesStatDto> LectSaleMonthly;
    private String bcode;
    private String cdLecture;        // cd_lecture
    private String lectureName;      // lecture_name
    private int studentCount;        // student_count
    private long total;    
}
