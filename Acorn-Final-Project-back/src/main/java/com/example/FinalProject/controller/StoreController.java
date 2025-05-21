package com.example.FinalProject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.FinalProject.dto.HCStoreDto;
import com.example.FinalProject.dto.HCStoreListDto;
import com.example.FinalProject.service.StoreService;


@RestController
public class StoreController {

    @Autowired
    private StoreService service;

    //지점 리스트 조회 (검색 + 페이징)
    @GetMapping("/store")
    public HCStoreListDto list(
            @RequestParam(defaultValue = "1") int pageNum,
            @ModelAttribute HCStoreDto search
    ) {
    	
        return service.getStoreList(pageNum, search);
    }

    // 지점 상세 조회
    @GetMapping("/store/{userId}")
    public HCStoreDto getDetail(@PathVariable int userId) {
        return service.getStoreDetail(userId);
    }

    // 지점 등록
    @PostMapping("/store")
    public void create(@RequestBody HCStoreDto dto) {
        service.insertStore(dto);
    }

    // 지점 정보 수정
    @PatchMapping("/store/{userId}")
    public void update(
            @PathVariable int userId,
            @RequestBody HCStoreDto dto
    ) {
        dto.setUserId(userId);
        service.updateStore(dto);
    }

    // 지점 삭제 (관리자 비밀번호 검증 포함)
    @DeleteMapping("/store/{userId}")
    public void delete(
            @PathVariable int userId,
            @RequestParam String adminPwd
    ) {
        boolean ok = service.deleteStoreWithAdminCheck(userId, adminPwd);
        if (!ok) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자 비밀번호가 일치하지 않습니다.");
        }
    }
}

