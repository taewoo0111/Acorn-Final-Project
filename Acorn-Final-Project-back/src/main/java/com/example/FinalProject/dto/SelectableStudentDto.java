package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("SelectableStudentDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SelectableStudentDto {
    private int studentId;
    private String name;
    private String phone;
    private boolean selectable;
    private String conflictReason; // 선택 불가 사유 (optional)

}
