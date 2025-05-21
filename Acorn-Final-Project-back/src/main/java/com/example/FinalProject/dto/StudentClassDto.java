package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("StudentClassDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class StudentClassDto {
    private int classId;
    private int studentId;
    private String className;
    private String studentName;
}
