package com.example.FinalProject.dto;

import java.util.List;

import lombok.Data;

@Data
public class GeminiRequest {
	private List<Content> contents;
	
	@Data
	public static class Content {
		private List<Part> parts;
	}
	
	@Data
	public static class Part {
		private String text;
	}
}
