package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("TeacherSearchPageDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TeacherSearchPageDto {
	private TeacherSearchRequestDto search;
	private TeacherPageRequestDto page;
}
