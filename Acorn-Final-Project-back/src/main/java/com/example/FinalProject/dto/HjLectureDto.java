package com.example.FinalProject.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class HjLectureDto {
	private String acode;
	private String bcode;
	private String bname;
	private String deleted;
}
