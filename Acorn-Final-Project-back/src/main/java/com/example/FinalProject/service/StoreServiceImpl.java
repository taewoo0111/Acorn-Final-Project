package com.example.FinalProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.HCStoreDto;
import com.example.FinalProject.dto.HCStoreListDto;
import com.example.FinalProject.mapper.StoreMapper;

@Service
public class StoreServiceImpl implements StoreService {
    private static final int PAGE_ROW_COUNT     = 10;
    private static final int PAGE_DISPLAY_COUNT = 5;

    @Autowired
    private StoreMapper mapper;

     @Autowired
     private PasswordEncoder passwordEncoder;

    @Override
    public HCStoreListDto getStoreList(int pageNum, HCStoreDto search) {
        int startRowNum = 1 + (pageNum - 1) * PAGE_ROW_COUNT;
        int endRowNum   = pageNum * PAGE_ROW_COUNT;

        int startPageNum = 1 + ((pageNum - 1) / PAGE_DISPLAY_COUNT) * PAGE_DISPLAY_COUNT;
        int endPageNum   = startPageNum + PAGE_DISPLAY_COUNT - 1;

        int totalRow      = mapper.getStoreCount(search);
        int totalPageCount = (int) Math.ceil(totalRow / (double) PAGE_ROW_COUNT);
        if (endPageNum > totalPageCount) endPageNum = totalPageCount;

        search.setStartRowNum(startRowNum);
        search.setEndRowNum(endRowNum);
        List<HCStoreDto> list = mapper.getStoreList(search);

        String findQuery = "";
        if (search.getKeyword() != null && !search.getKeyword().isEmpty()) {
            findQuery = "&keyword=" + search.getKeyword() + "&condition=" + search.getCondition();
        }

        return HCStoreListDto.builder()
                             .list(list)
                             .startPageNum(startPageNum)
                             .endPageNum(endPageNum)
                             .totalPageCount(totalPageCount)
                             .pageNum(pageNum)
                             .totalRow(totalRow)
                             .findQuery(findQuery)
                             .condition(search.getCondition())
                             .keyword(search.getKeyword())
                             .build();
    }

    @Override
    public void insertStore(HCStoreDto dto) {
        // 비밀번호 암호화 처리 주석 처리됨
         dto.setPwd(dto.getPwd());
        mapper.insertStore(dto);
    }

    @Override
    public HCStoreDto getStoreDetail(int userId) {
        return mapper.getStoreDetail(userId);
    }

    @Override
    public void updateStore(HCStoreDto dto) {
        // 비밀번호가 전달되었을 경우에만 암호화
        if (dto.getPwd() != null && !dto.getPwd().isEmpty()) {
            dto.setPwd(passwordEncoder.encode(dto.getPwd())); 
        }
        mapper.updateStore(dto);
    }
 

    @Override
    public boolean deleteStoreWithAdminCheck(int userId, String adminPwd) {
        // 관리자 비밀번호 검증 로직 주석 처리됨
         String adminHash = mapper.getAdminPwdById(9999);
         System.out.println(adminHash);
         System.out.println(adminPwd);
         if (adminPwd != null && adminPwd.equals(adminHash)) {
             mapper.deleteStore(userId);
             return true;
         }
         return false;
    }
}
