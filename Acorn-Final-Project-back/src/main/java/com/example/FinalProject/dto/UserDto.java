package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("userDto")	//application.properties 에 설정이 있어야 동작한다 (type 별칭 부여)
@Builder
@AllArgsConstructor	//모든 필드값을 전달 받는 생성자(Builder 를 사용하려면 필요함)
@NoArgsConstructor	//빈 생성자
@Data	//setter, getter
public class UserDto {
	private long num;
	private String userName;
	private String password;
	private String newPassword;
	private String email;
	private String role;
	private String profileImage;
	private String createdAt;
	private String updatedAt;
	//프로필 이미지 파일 업로드 처리를 하기 위한 필드
	private MultipartFile profileFile;
}
