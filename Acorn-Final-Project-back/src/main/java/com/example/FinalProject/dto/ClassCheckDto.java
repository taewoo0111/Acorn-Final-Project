package com.example.FinalProject.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("ClassCheckDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ClassCheckDto {
    private List<Integer> studentIdList;
    private String newWeekday;
    private String newStartTime;
    private String newEndTime;
	
}
