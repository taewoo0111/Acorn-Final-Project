package com.example.FinalProject.exception;

//금지된 요청일때 발생시킬 Exception 정의하기
public class DeniedException extends RuntimeException{
	
	public DeniedException(String msg) {
		super(msg);
	}
}
