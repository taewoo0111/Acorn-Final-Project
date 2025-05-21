package com.example.FinalProject.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

//예외 컨트롤러는 @ControllerAdvice 어노테이션을 붙여서 bean 으로 만든다.
@ControllerAdvice
public class ExceptionController {
	
	@ExceptionHandler(DeniedException.class)
	public String denied(DeniedException de, Model model) {
		//예외 객체를 template 페이지에 전달하기
		model.addAttribute("exception", de);
		
		return "error/denied";
	}
	
	/*
	 * 	PATCH "/user/password" 요청을 처리하는 중에 기본 비밀번호가 일치 하지 않으면
	 * 	UserService 객체에서 PasswordException 이 발생한다
	 */
	@ExceptionHandler(PasswordException.class)
	public ResponseEntity<String> password(PasswordException pe) {
		//기존 비밀번호가 잘못 입력된 요청이라고 응답한다.
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(pe.getMessage());
	}
}
