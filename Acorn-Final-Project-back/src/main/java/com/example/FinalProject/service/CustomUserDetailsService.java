package com.example.FinalProject.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.UserDto;
import com.example.FinalProject.repository.UserDao;

/*
 * 	Spring Security 가 로그인 처리시 호출하는 메소드를 가지고 있는 서비스 클래스 정의하기
 */

@Service //bean 으로 만들기 위한 어노테이션 
public class CustomUserDetailsService implements UserDetailsService{
	//의존 객체 주입
	@Autowired private UserDao dao;
	
	//username 을 전달하면 해당 user 의 자세한 정보를 리턴하는 메소드
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		//원래는 DB 에서 dao 를 이용해 username 에 해당하는 사용자정보(UserDto) 를 얻어와야 한다.
		UserDto dto = dao.getData(username);
		
		//만일 존재하지 않는 사용자라면
		if(dto == null) {
			throw new UsernameNotFoundException("존재 하지 않는 사용자 입니다.");
		}
		
		//권한 목록을 List 에 담아서  (지금은 1개 이지만)
		List<GrantedAuthority> authList=new ArrayList<>();
		//DB 에 저장된 role 정보에는 ROLE_ 가 붙어 있지 않다 
		authList.add(new SimpleGrantedAuthority("ROLE_"+dto.getRole()));
		
		//UserDetails 객체를 생성해서 
		UserDetails ud=new User(dto.getUserName(), dto.getPassword(), authList);
		//리턴해준다.
		return ud;
	}

}
