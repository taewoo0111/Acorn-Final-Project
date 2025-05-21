package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("TeacherDto")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TeacherDto {
	private int teacherId;
	private String name;
	private int userId;
	private String storeName;
	private String birth;
	private String phone;
	private int salary;
	private String cdStatus; // bcode : 'WORK', 'T_QUIT'
	private String statusName; // bname : '재직', '퇴직'
	private String classNames; // 강사 목록에서 현재 담당 수업 정보(LISTAGG 결과)
	
	private TeacherClassHistoryDto history;

}
