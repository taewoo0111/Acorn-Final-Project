package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("CodeDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class HCCodeDto {
	private String acode;
	private String aname;
	private String bcode;
	private String bname;
}
