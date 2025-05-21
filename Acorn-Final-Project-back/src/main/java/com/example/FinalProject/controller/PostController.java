package com.example.FinalProject.controller;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.FinalProject.dto.HCPostDto;
import com.example.FinalProject.dto.HCPostListDto;
import com.example.FinalProject.service.PostService;

@RestController
public class PostController {
	
	@Value("${file.location}")
	private String fileLocation;

	@Autowired private PostService service;
	//목록 
	@GetMapping("/posts")
	public HCPostListDto list(@RequestParam(defaultValue = "1") int pageNum, HCPostDto search) {
		
		HCPostListDto dto = service.getlist(pageNum, search);
		
		return dto;
	}
	//글 자세히 보기
	@GetMapping("/posts/{postId}")
	 public HCPostDto detail(@PathVariable int postId) {
        return service.getPostData(postId);
    }
	
	//글 추가
	@PostMapping("/posts")
	public ResponseEntity<String> insert(
	    @RequestParam("title") String title,
	    @RequestParam("writer") String writer,
	    @RequestParam("content") String content,
	    @RequestParam(value = "uploadFile", required = false) MultipartFile uploadFile
	) {
	    String savedFileName = null;
	    if (uploadFile != null && !uploadFile.isEmpty()) {
	        String originalName = uploadFile.getOriginalFilename();
	        savedFileName = UUID.randomUUID().toString() + "_" + originalName;
	        File saveFile = new File(fileLocation, savedFileName);
	        try {
				uploadFile.transferTo(saveFile);
			} catch (IllegalStateException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
	    }
	    HCPostDto dto = HCPostDto.builder()
	        .title(title)
	        .writer(writer)
	        .content(content)
	        .uploadFile(savedFileName) // 여기엔 파일명만 저장
	        .build();

	    service.insertPost(dto);
	    return ResponseEntity.ok("등록 완료");
	}

	//글 수정
	@PatchMapping("/posts/{postId}")
	public ResponseEntity<String> update(
	    @PathVariable int postId,
	    @RequestParam("title") String title,
	    @RequestParam("writer") String writer,
	    @RequestParam("content") String content,
	    @RequestParam(value = "uploadFile", required = false) MultipartFile uploadFile
	) {
	    try {
	        String fileName = null;
	        if (uploadFile != null && !uploadFile.isEmpty()) {
	            fileName = UUID.randomUUID() + "_" + uploadFile.getOriginalFilename();
	            File saveFile = new File(fileLocation, fileName);
	            if (!saveFile.getParentFile().exists()) saveFile.getParentFile().mkdirs();
	            uploadFile.transferTo(saveFile);
	        }

	        HCPostDto dto = HCPostDto.builder()
	                .postId(postId)
	                .title(title)
	                .writer(writer)
	                .content(content)
	                .uploadFile(fileName) // 기존 파일 그대로 유지하고 싶다면 null 체크로 분기 필요
	                .build();

	        service.updatePost(dto);
	        return ResponseEntity.ok("수정 완료");
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.internalServerError().body("수정 실패");
	    }
	}


	//글 삭제
	@DeleteMapping("/posts/{postId}")
	public ResponseEntity<String> delete(@PathVariable int postId) {
	    service.deletePost(postId);
	    return ResponseEntity.ok("삭제 완료");
	}
}