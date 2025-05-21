package com.example.FinalProject.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("TWCeoSalePageDto")
public class TWCeoSalePageDto {
    private List<TWCeoSaleDto> content;  // 실제 데이터를 담을 필드 추가
    private int pageNum;
    private int startRowNum;
    private int endRowNum;
    private int totalRow;
    private int totalPageCount;
    private int startPageNum;
    private int endPageNum;
}
