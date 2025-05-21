package com.example.FinalProject.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("JsAdminSalesDto")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class JsAdminSalesDto {
	private Integer adminSaleId;//지점 adminsale 고유번호
	private Integer userId;//원장 ID(매장번호) = tb_user.storename
	private String saleName;//매출 항목
	private String creDate;//매출 날짜
	private String editDate;//매출 수정 날짜
	private int price;//항목 금액
	private String cdAcode;//구분코드 : 수입/지출
	private String cdBcode;//상세구분코드 : 수업료수입, 기타수입,강사월급, 발주비용, 기타지출
	private List<String> checkedItems;//검색조건
	private String auto;//default: yes(발주나 수업에서 처리됨), no: 담당자가 직접 입력
	private int startRowNum;
	private int endRowNum;
	private int pageNum;
	private List<JsAdminSalesDto> list;
	private int startPageNum;
	private int endPageNum;
	private int totalPageCount;
	private int totalRow;
	private String aname;
	private String bname;
}
