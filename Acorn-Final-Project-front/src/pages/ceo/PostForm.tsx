import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { initEditor } from '../../editor/SmartEditor';

function PostWrite() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [editorTool, setEditorTool] = useState<any>([]);
  const inputTitle = useRef<HTMLInputElement>(null);
  const inputWriter = useRef<HTMLInputElement>(null);
  const inputContent = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setEditorTool(initEditor("content")); // SmartEditor 초기화
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.current?.value || !inputWriter.current?.value) {
      return alert("제목과 작성자는 필수입니다.");
    }

    editorTool.exec(); // SmartEditor 내용을 textarea로 반영

    const formData = new FormData();
    formData.append("title", inputTitle.current.value);
    formData.append("writer", inputWriter.current.value);
    formData.append("content", inputContent.current?.value || "");

    if (uploadFile) {
      formData.append("uploadFile", uploadFile);
    }

    api.post("/posts", formData)
      .then(() => {
        alert("등록 완료!");
        navigate("/posts");
      })
      .catch((error) => {
        console.error(error);
        alert("등록 실패");
      });
  };

  return (
    <Container className="mt-4">
      <h3>공지 작성</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>제목</Form.Label>
          <Form.Control ref={inputTitle} placeholder="제목 입력..." />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>작성자</Form.Label>
          <Form.Control ref={inputWriter} placeholder="작성자 이름 입력..." />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>첨부파일</Form.Label>
          <Form.Control type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>내용</Form.Label>
          <textarea id="content" ref={inputContent} className="form-control" rows={10}></textarea>
        </Form.Group>

        <div className="text-end">
          <Button type="submit">등록</Button>
        </div>
      </Form>
    </Container>
  );
}

export default PostWrite;
