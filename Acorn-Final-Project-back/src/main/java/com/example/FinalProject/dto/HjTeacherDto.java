package com.example.FinalProject.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class HjTeacherDto {
	private int teacherId;
	private String name;
	private int userId;
	private String cdStatus;
}
