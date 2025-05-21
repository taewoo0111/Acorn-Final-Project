package com.example.FinalProject.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.service.GeminiService;

import reactor.core.publisher.Mono;

@RestController
public class GeminiController {
	
	@Autowired private GeminiService service;
	
	@PostMapping("/gemini/quiz")
	public Mono<String> quiz(@RequestBody Map<String, String> map) {
		// GeminiService의 quiz 메서드를 호출하여 결과를 반환
        return service.quiz2(map);
	}
}
