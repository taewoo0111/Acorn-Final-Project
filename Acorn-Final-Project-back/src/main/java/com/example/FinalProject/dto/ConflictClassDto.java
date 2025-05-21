package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("ConflictClassDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ConflictClassDto {
    private int classId;
    private String className;
    private String startDate;
    private String endDate;
    private String weekday;
    private String startTime;
    private String endTime;
}
