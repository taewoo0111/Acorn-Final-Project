package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("StoreDto")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HCStoreDto {
    private int userId;               
    private String storeName;          
    private String storeCall;       
    private String id;                 
    private String pwd;             
    private String userName;         
    private String phone;             
    private String cdRole;            

    
    private int startRowNum;
    private int endRowNum;
    private String condition;         
    private String keyword;          
}