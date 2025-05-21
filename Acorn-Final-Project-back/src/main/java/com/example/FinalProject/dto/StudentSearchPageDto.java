package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("StudentSearchPageDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentSearchPageDto {
	private StudentSearchRequestDto search;
	private StudentPageRequestDto page;
	private String state;
}
