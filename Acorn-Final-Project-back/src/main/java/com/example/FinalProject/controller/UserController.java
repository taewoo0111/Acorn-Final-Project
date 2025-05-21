package com.example.FinalProject.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.UserDto;
import com.example.FinalProject.service.UserService;
import com.example.FinalProject.util.JwtUtil;

@RestController
public class UserController {
	
	@Autowired JwtUtil jwtUtil;
	//SecurityConfig 클래스에서 Bean 이된 AuthenticationManager 객체 주입받기
	@Autowired AuthenticationManager authManager;
	
	@Autowired UserService userService;
	
	@PatchMapping("/user/password")
	public String updatePassword(@RequestBody UserDto dto) {
		
		userService.changePassword(dto);
		
		return "success!";
	}
	
	//json 문자열이 전송되는게 아니기 때문에 @RequestBody 는 필요 없다
	@PatchMapping("/user")
	public String updateUser(UserDto dto) {
		
		userService.updateUserInfo(dto);
		
		return "success!";
	}
	
	@GetMapping("/user")
	public UserDto getInfo() {
		//이미 1회성 로그인이 되어 있기 때문에 userName 을 얻어낼수 있다. 
		String userName=SecurityContextHolder.getContext().getAuthentication().getName();
		return userService.getByUserName(userName);
	}
	
	//클라이언트가 토큰이 정상 동작하는지 확인할 요청 경로
	@GetMapping("/ping")
	public String ping() {
		return "pong";
	}
	
	@PostMapping("/auth")
	public ResponseEntity<String> auth(@RequestBody UserDto dto) throws Exception{
		Authentication authentication=null;
		try {
			UsernamePasswordAuthenticationToken authToken=
					new UsernamePasswordAuthenticationToken(dto.getUserName(), dto.getPassword());
			//인증 메니저 객체를 이용해서 인증을 진행한다.
			authentication=authManager.authenticate(authToken);
		}catch(Exception e) {
			//예외가 발생하면 인증실패(아이디 혹은 비밀번호 틀림 등등...)
			e.printStackTrace();
			// 401 UNAUTHORIZED 에러를 응답하면서 문자열 한줄 보내기 
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패!");
		}

		//Authentication 객체에는 인증된 사용자 정보가 들어 있다. userName, role 등등 
		//현재는 role 을 하나만 부여하기 때문에 0 번 방에 있는 데이터만 불러오면 된다. 
		GrantedAuthority authority=authentication.getAuthorities().stream().toList().get(0);
		//ROLE_XXX 형식
		String role=authority.getAuthority();
		//"role" 이라는 키값으로 Map 에 담기 
		Map<String, Object> claims=Map.of("role", role);

		//예외가 발생하지 않고 여기까지 실행 된다면 인증을 통과 한 것이다. 토큰을 발급해서 응답한다.
		String token=jwtUtil.generateToken(dto.getUserName(), claims);
		//발급받은 토큰 문자열을 ResponseEntity 에 담아서 리턴한다.
		return ResponseEntity.ok("Bearer "+token);
	}
}