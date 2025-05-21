import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Button, Row, Col, Container } from 'react-bootstrap';

interface Post {
  postId: number;
  title: string;
  writer: string;
  creDate: string;
  editDate: string;
  content: string;
  uploadFile: string;
}

function AdminPostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/posts/${postId}`).then(res => setPost(res.data));
  }, [postId]);


  if (!post) return <div>Loading...</div>;

  return (
    <Container style={{ marginTop: '150px' }}>
      <h3 className="mb-7">{post.title}</h3>
      <Row className="mb-3">
        <Col className="border p-2 rounded mx-2"><strong>공지 ID</strong> {post.postId}</Col>
        <Col className="border p-2 rounded mx-2"><strong>작성자</strong> {post.writer}</Col>
        <Col className="border p-2 rounded mx-2"><strong>작성 날짜</strong> {post.creDate}</Col>
        <Col className="border p-2 rounded "><strong>수정 날짜</strong> {post.editDate}</Col>
      </Row>
      <Row className="mb-4 justify-content-end">
        <Col md="auto"><strong>파일 다운로드</strong></Col>
        <Col md="auto">{post.uploadFile}</Col>
        <Col md="auto">
          {post.uploadFile && (
            <a
              href={`/download/${post.uploadFile}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-sm"
            >
              다운로드
            </a>
          )}
        </Col>
      </Row>
      <div
        className="border p-3 mb-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
        style={{height:300}}
      ></div>
      <div className="text-end">
        <Button variant="secondary" onClick={() => navigate('/admin/notice')}>목록</Button>
      </div>
    </Container>
  );
}

export default AdminPostDetail;
