package com.example.FinalProject.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.FinalProject.filter.JwtFilter;

@Configuration //설정 클래스라고 알려준다
@EnableWebSecurity //Security 를 설정하기 위한 어노테이션
@EnableMethodSecurity(securedEnabled = true) //Controller 메소드에서 권한 체크 가능 하도록
public class SecurityConfig {
	
	//jwt 를 쿠키로 저장할때 쿠키의 이름
	@Value("${jwt.name}")
	private String jwtName;
	
	@Autowired
	private JwtFilter jwtFilter;
	
	/*
	 *  매개변수에 전달되는 HttpSecurity 객체를 이용해서 우리의 프로젝트 상황에 맞는 설정을 기반으로 
	 *  만들어진 SecurityFilterChain 객체를 리턴해주어야 한다.
	 *  또한 SecurityFilterChain 객체도 스프링이 관리하는 Bean 이 되어야 한다  
	 */
	@Bean //메소드에서 리턴되는 SecurityFilterChain 을 bean 으로 만들어준다.
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception{

		String[] whiteList= {"/**","/auth","/upload/**","/editor_upload","/gemini/**", 
				"/sales/**", "/students/**", "/teachers/**", "/class/**",
				"/inv/**","/ord/**", "/pdt/**"};

		httpSecurity
		.headers(header->
			//동일한 origin 에서 iframe 을 사용할수 있도록 설정(default 값은 사용불가)
			header.frameOptions(option->option.sameOrigin()) //SmartEditor 에서 필요함
		)
		.csrf(csrf->csrf.disable())
		.authorizeHttpRequests(config ->
			config
				.requestMatchers(whiteList).permitAll()
				.requestMatchers("/ceo/**").hasRole("CEO")
				.requestMatchers("/admim/**").hasAnyRole("ADMIN", "STAFF")
				.requestMatchers(HttpMethod.POST, "/user").permitAll()	//api 회원가입 요청은 받아 들이도록
				.requestMatchers(HttpMethod.GET, "/posts", "/posts/**").permitAll()	//글 목록, 자세히보기 요청 공개
				.anyRequest().authenticated()
		)
		.sessionManagement(config ->
			//세션을 사용하지 않도록 설정한다.
			config.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
		)
		//JwtFilter 를 Spring Security 필터보다 미리 수행되게 하기
		.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		
		// 설정 정보를 가지고 있는 HttpSecurity 객체의 build() 메소드를 호출해서 리턴되는 객체를 리턴해준다.
		return httpSecurity.build();
	}
	
	//비밀번호를 암호화 해주는 객체를 bean 으로 만든다.
	@Bean
	PasswordEncoder passwordEncoder() { 
		//여기서 리턴해주는 객체도 bean 으로 된다.
		return new BCryptPasswordEncoder();
	}
	//인증 메니저 객체를 bean 으로 만든다. (Spring Security 가 자동 로그인 처리할때도 사용되는 객체)
	@Bean
	AuthenticationManager authenticationManager(HttpSecurity http,
			BCryptPasswordEncoder encoder, UserDetailsService service) throws Exception{
		//적절한 설정을한 인증 메니저 객체를 리턴해주면 bean 이 되어서 Spring Security 가 사용한다 
		return http.getSharedObject(AuthenticationManagerBuilder.class)
				.userDetailsService(service)
				.passwordEncoder(encoder)
				.and()
				.build();
	}
	
}