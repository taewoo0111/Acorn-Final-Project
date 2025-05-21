package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("StudentDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentDto {
	private int studentId;
	private String name;
	private String phone;
	private int userId;
	private String storeName;
	private String cdStatus; // bcode : 'STUDY', 'S_QUIT'
	private String statusName; // bname : '재원', '퇴원'

	private String classNames; // 학생 목록에서 현재 수강 수업 정보(LISTAGG 결과)
	
	private StudentClassHistoryDto history;
/*
	private StudentPageRequestDto pageRequest;
	
*/	

}
