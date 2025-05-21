package com.example.FinalProject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.HCProductDto;
import com.example.FinalProject.dto.HCProductListDto;
import com.example.FinalProject.service.ProductService;


@RestController
public class ProductController {
	
	@Autowired private ProductService service;
	//품목 리스트
	@GetMapping("/product")
    public HCProductListDto list(@RequestParam(defaultValue = "1") int pageNum, HCProductDto search) {
     
		HCProductListDto dto = service.getList(pageNum, search);
		
        return dto;
    }
	//품목 보기
	@GetMapping("/product/{productId}")
	public HCProductDto getData(@PathVariable int productId) {
	    return service.getData(productId);
	}
	//품목 추가
	@PostMapping("/product")
	public void insert(@RequestBody HCProductDto dto) {
		service.insertProduct(dto);
	}
	//품목 가격 수정
	// 추가: 품목 가격 수정
	@PatchMapping("/product/{productId}")
	public void update(@PathVariable int productId,
		    @RequestBody HCProductDto dto) {
		dto.setProductId(productId);
	    service.updateProduct(dto);
	}

	//품목 삭제(상태값 변경)
	@DeleteMapping("/product/{productId}")
	public void delete(@PathVariable int productId) {
	    service.hideProduct(productId);
	}

}