package com.example.FinalProject.dto;

import lombok.Data;

@Data
public class SalesDto {
	int adminsaleid;//지점 adminsale 고유번호
	int ceosaleid;//본사 ceosale 고유번호
	int storenum;//매장번호 = tb_user.storename
	String salename;//매출 항목
	String credate;//매출 날짜
	String editdate;//매출 수정 날짜
	int price;//항목 금액
	String acode;//구분코드 : 수입/지출
	String bcode;//상세구분코드 : 수업료수입, 기타수입,강사월급, 발주비용, 기타지출
	String auto;//default: yes(발주나 수업에서 처리됨), no: 담당자가 직접 입력

	//쿼리문 관련
	int totalprice;//총금액
	String sdate;//문자열로 변환된 date 타입의 data
	String smonth;//상기 동일  
	String syear;//상기 동일
	//수업 관련 : tb_class, tb_student_class
	String clsstatus;//수업 상태 : 진행중
	int classid;//수업 고유 번호
	int clsprice;//수업료
	int studentcount;//학생 수
	
	//발주 관련 :tb_product, tb_order, tb_order_detail
	int orderid;//발주고유번호
	int orderstatus;//발주상태
	int orderdetailid;//발주 품목의 고유번호
	int productid;//tb_product.productid
	int quantity;//수량
	int productprice;//개당 가격
	int productname;//품목 이름
	
	

}
