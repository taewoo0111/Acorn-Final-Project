package com.example.FinalProject.service;

import com.example.FinalProject.dto.HCStoreDto;
import com.example.FinalProject.dto.HCStoreListDto;

public interface StoreService {
	//지점 리스트
	public HCStoreListDto getStoreList(int pageNum, HCStoreDto dto);
	//지점 상세보기
    public HCStoreDto getStoreDetail(int userId);
    //지점 등록
    public void insertStore(HCStoreDto dto);
    //지점 수정
    public void updateStore(HCStoreDto dto);
    //지점 삭제
    public boolean deleteStoreWithAdminCheck(int userId, String adminPwd);
}
