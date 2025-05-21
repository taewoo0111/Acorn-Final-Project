package com.example.FinalProject.service;

import java.io.File;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.FinalProject.dto.UserDto;
import com.example.FinalProject.exception.PasswordException;
import com.example.FinalProject.repository.UserDao;

@Service
public class UserServiceImpl implements UserService{
	
	@Autowired private UserDao dao;
	//SecurityConfig 클래스에 @Bean 설정으로 bean 이된 PasswordEncoder 객체 주입 받기
	@Autowired private PasswordEncoder encoder;
	//업로드된 이미지를 저장할 위치 얻어내기
	@Value("${file.location}") private String fileLocation;
	
	@Override
	public UserDto getByNum(long num) {
		
		return dao.getData(num);
	}

	@Override
	public UserDto getByUserName(String userName) {
		
		return dao.getData(userName);
	}

	@Override
	public void createUser(UserDto dto) {
		//저장할때 비밀번호를 암호화 한 후에 저장 되도록 한다.
		String encodedPwd = encoder.encode(dto.getPassword());
		//인코딩된 비밀번호를 다시 dto 객체에 넣어주고
		dto.setPassword(encodedPwd);
		//DB 에 저장한다.
		int rowCount = dao.insert(dto);
		if(rowCount == 0) {
			throw new RuntimeException("회원정보 저장 실패");
		}
	}

	@Override
	public void updateUserInfo(UserDto dto) {
		//MultipartFile 객체
		MultipartFile image = dto.getProfileFile();
		//만일 파일이 업로드 되지 않았다면
		if(!image.isEmpty()) {
			//원본 파일명
			String orgFileName = image.getOriginalFilename();
			//이미지의 확장자를 유지하기 위해 뒤에 원본 파일명을 추가한다
			String saveFileName = UUID.randomUUID().toString() + orgFileName;
			//저장할 파일의 전체 경로 구성하기
			String filePath = fileLocation + File.separator + saveFileName;
			try {
				//업로드된 파일을 저장할 파일 객체 생성
				File saveFile = new File(filePath);
				image.transferTo(saveFile);
			}catch (Exception e) {
				e.printStackTrace();
			}
			//UserDto 에 저장된 이미지의 이름을 넣어준다.
			dto.setProfileImage(saveFileName);
		}
		//로그인된 userName 도 dto 에 담아준다.
		String userName = SecurityContextHolder.getContext().getAuthentication().getName();
		dto.setUserName(userName);
		
		//dao 를 이용해서 수정 반영한다
		dao.update(dto);
		
	}

	@Override
	public void changePassword(UserDto dto) {
		//1. 로그인된 userName 을 얻어낸다.
		String userName = SecurityContextHolder.getContext().getAuthentication().getName();
		//2. 기존의 비밀번호를 DB 에서 읽어와서 (암호화된 비밀번호)
		String encodedPwd = dao.getData(userName).getPassword();
		//3. 입력한(암호화 되지 않은 구 비밀번호) 와 일치하는지 비교해서
		//. checkpw( 암호화 되지 않은 비밀번호, 암호화 된 비밀번호)
		boolean isValid = BCrypt.checkpw(dto.getPassword(), encodedPwd);
		//4 만일 일치하지 않으면 Exception 을 발생 시킨다.
		if(!isValid) {
			throw new PasswordException("기존 비밀번호가 일치하지 않습니다!");
		}
		//5. 일치하면 새비밀번호를 암호화해서 dto 에 담은 다음
		dto.setNewPassword(encoder.encode(dto.getNewPassword()));
		//6. userNmae 도 dto 에 담고
		dto.setUserName(userName);
		//7. DB 에 비밀번호 수정 반영을 한다.
		dao.updatePassword(dto);
	}
}
