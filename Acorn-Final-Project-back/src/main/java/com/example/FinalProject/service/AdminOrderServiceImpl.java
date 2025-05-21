package com.example.FinalProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.EuOrderDetailDto;
import com.example.FinalProject.dto.EuOrderListDto;
import com.example.FinalProject.dto.EuProdcutListDto;
import com.example.FinalProject.dto.EuProductDto;
import com.example.FinalProject.mapper.AdminOrderMapper;

@Service
public class AdminOrderServiceImpl implements AdminOrderService{
	
	@Autowired private AdminOrderMapper mapper;
	

	//한 페이지에 몇개씩 표시할 것인지
	final int PAGE_ROW_COUNT=10;
	//하단 페이지를 몇개씩 표시할 것인지
	final int PAGE_DISPLAY_COUNT=5;
	
	// 발주 현황 리스트 조회
	@Override
	public EuOrderListDto getOrdList(int pNum, EuOrderListDto dto) {
		System.out.println("---1");
		//보여줄 페이지의 시작 ROWNUM
		int startRowNum=1+(pNum-1)*PAGE_ROW_COUNT;
		//보여줄 페이지의 끝 ROWNUM
		int endRowNum=pNum*PAGE_ROW_COUNT;
		
		//하단 시작 페이지 번호 
		int startPageNum = 1 + ((pNum-1)/PAGE_DISPLAY_COUNT)*PAGE_DISPLAY_COUNT;
		//하단 끝 페이지 번호
		int endPageNum=startPageNum+PAGE_DISPLAY_COUNT-1;
		
		System.out.println("---2");
		//전체 글의 갯수
		int totalRow=mapper.getOrdCnt(dto);
		//전체 페이지의 갯수 구하기
		int totalPageCount=(int)Math.ceil(totalRow/(double)PAGE_ROW_COUNT);
		//끝 페이지 번호가 이미 전체 페이지 갯수보다 크게 계산되었다면 잘못된 값이다.
		if(endPageNum > totalPageCount){
			endPageNum=totalPageCount; //보정해 준다. 
		}	
		// startRowNum 과 endRowNum 을 PostDto 객체에 담아서
		dto.setStartRowNum(startRowNum);
		dto.setEndRowNum(endRowNum);
		dto.setStartPageNum(startPageNum);
		dto.setEndPageNum(endPageNum);
		dto.setTotalPageCount(totalPageCount);
		dto.setTotalRow(totalRow);
		dto.setPageNum(pNum);
		
		System.out.println("---3");
		dto.setList(mapper.getOrd(dto));
		
		System.out.println("---4");
		return dto;
	}

	// 특정 발주 상세보기
	@Override
	public EuOrderDetailDto getOrdDetail(int ordId) {
		EuOrderDetailDto dto = new EuOrderDetailDto();
		dto.setInfoDto(mapper.getOrdInfo(ordId));
		dto.setItemList(mapper.getOrdItem(ordId));
		return dto;
	}

	// 주문 가능 품목 리스트 조회
	@Override
	public EuProdcutListDto getProductList(EuProdcutListDto dto) {
		dto.setList(mapper.getProduct(dto));
		return dto;
	}

	// 리스트에서 특정 품목을 발주서에 추가할 정보 가져오기
	@Override
	public EuProductDto getProduct(int pId) {
		return mapper.getProductOne(pId);
	}

	// 새 발주서 추가 (또는 임시저장)
	@Override
	public void addOrd(EuOrderDetailDto dto) {
		System.out.println("새 발주 추가 메소드 들어옴2");
		// (0) 사용될 시퀀스 번호 구하기 (값을 구해 저장한 후, 발주서 및 발주 품목 추가 시 활용)
		int ordSeq = mapper.getOrdSeq();
		System.out.println("새 시퀀스는: "+ordSeq);
		
		// (1) 발주 정보 추가
		System.out.println("####");
		dto.getInfoDto().setOrderId(ordSeq);
		System.out.println("%%%%");
		System.out.println("추가될 order info : " + dto.getInfoDto() );
		mapper.addOrdInfo(dto.getInfoDto());
		System.out.println("333");
		
		// (2) 발주 아이템 추가
		dto.getItemList().forEach(item -> {
			item.setOrderId(ordSeq);
			System.out.println("추가될 item : " +item);
		    mapper.addOrdItem(item);
		    System.out.println("item 하나 성공");
		});
		System.out.println("444");
	}

	// 기존 발주서 수정
	@Override
	public void editOrd(EuOrderDetailDto dto) {
		System.out.println("기존 발주 수정 메소드 들어옴22");
		
		// (0) 사용될 시퀀스 번호 구하기 (값을 구해 저장한 후, 발주서 및 발주 품목 추가 시 활용)
		int ordSeq = dto.getInfoDto().getOrderId();
		System.out.println("111");
		
		// (1) 발주서 정보 수정
		mapper.editOrdInfo(dto.getInfoDto());
		System.out.println("222");
		
		// (2) 발주 품목 다 지우기 (어떤 품목의 어디를 수정했는지 추적하기 복잡하기 때문에 모두 삭제 후 다시 집어넣습니다.)
		mapper.deleteOrdItem(ordSeq);
		System.out.println("333");
		
		// (3) 발주서의 품목 정보 *품목 개수 만큼 반복 실행
		dto.getItemList().forEach(item -> {
			item.setOrderId(ordSeq);
			System.out.println("추가될 item : " +item);
		    mapper.addOrdItem(item);
		    System.out.println("item 하나 성공");
		});
		System.out.println("444");
	}

	// 임시저장된 발주서가 있는지 확인
	@Override
	public int getTmpOrdId() {
		int ordId = -1;
		try {
			ordId = mapper.getTmpOrdId();
		}catch(Exception e) {
			System.out.println("임시저장 된 발주서는 없습니다.");
		}
		return ordId;
	}

	// 발주서 삭제
	@Override
	public void deletedOrd(int ordId) {
		System.out.println("삭제할 번호: " +ordId);
		// 자식 테이블 데이터 먼저 삭제
		mapper.deleteOrdC(ordId);
		// 이후 부모 테이블 데이터 삭제
		mapper.deleteOrdP(ordId);
	}

	// 사용자의 지점 전화번호 가져오기
	@Override
	public String getStoreCall(int userId) {
		return mapper.getStoreCall(userId);
	}

	// 임시 저장된 발주서를 요청
	@Override
	public void editToOrd(EuOrderDetailDto dto) {
		System.out.println("기존 발주 수정 메소드 들어옴22");
		
		// (0) 사용될 시퀀스 번호 구하기 (값을 구해 저장한 후, 발주서 및 발주 품목 추가 시 활용)
		int ordSeq = dto.getInfoDto().getOrderId();
		System.out.println("111");
		
		// (1) 발주서 정보 수정 222
		mapper.editToOrdInfo(dto.getInfoDto());
		System.out.println("222");
		
		// (2) 발주 품목 다 지우기 (어떤 품목의 어디를 수정했는지 추적하기 복잡하기 때문에 모두 삭제 후 다시 집어넣습니다.)
		mapper.deleteOrdItem(ordSeq);
		System.out.println("333");
		
		// (3) 발주서의 품목 정보 *품목 개수 만큼 반복 실행
		dto.getItemList().forEach(item -> {
			item.setOrderId(ordSeq);
			System.out.println("추가될 item : " +item);
		    mapper.addOrdItem(item);
		    System.out.println("item 하나 성공");
		});
		System.out.println("444");
		
	}

	
	
}
