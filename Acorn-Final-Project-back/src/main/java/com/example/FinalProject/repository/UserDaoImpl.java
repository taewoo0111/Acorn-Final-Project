package com.example.FinalProject.repository;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.FinalProject.dto.UserDto;

@Repository
public class UserDaoImpl implements UserDao{
	
	@Autowired private SqlSession session;

	@Override
	public UserDto getData(long num) {
		/*
		 * 	namespace : user
		 * 	sql's id : getByNum 
		 * 	parameterType : long
		 * 	resultType : UserDto
		 */
		
		return session.selectOne("user.getByNum", num);
	}

	@Override
	public UserDto getData(String userName) {
		
		return session.selectOne("user.getByUserName", userName);
	}

	@Override
	public int insert(UserDto dto) {
		
		return session.insert("user.insert", dto);
	}

	@Override
	public int updatePassword(UserDto dto) {
		return session.update("user.updatePassword", dto);
	}

	@Override
	public int update(UserDto dto) {
		return session.update("user.update", dto);
	}
	
}
