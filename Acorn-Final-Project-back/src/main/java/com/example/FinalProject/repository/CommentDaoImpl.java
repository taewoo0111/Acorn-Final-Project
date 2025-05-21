package com.example.FinalProject.repository;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.FinalProject.dto.CommentDto;

@Repository
public class CommentDaoImpl implements CommentDao{
	
	@Autowired private SqlSession session;
	
	@Override
	public int insert(CommentDto dto) {
		
		return session.insert("comment.insert", dto);
	}

	@Override
	public int update(CommentDto dto) {
		
		return session.update("comment.update", dto);
	}

	@Override
	public int delete(long num) {
		
		return session.delete("comment.delete", num);
	}

	@Override
	public long getSequence() {
		
		return session.selectOne("comment.getSequence");
	}

	@Override
	public CommentDto getData(long num) {
		
		return session.selectOne("comment.getData", num);
	}

	@Override
	public List<CommentDto> getList(CommentDto dto) {
		
		return session.selectList("comment.getList", dto);
	}

	@Override
	public int getCount(long postNum) {
		
		return session.selectOne("comment.getCount", postNum);
	}

}