import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { initEditor } from '../../editor/SmartEditor';

function PostEdit() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [editorReady, setEditorReady] = useState(false);

  const inputContent = useRef<HTMLTextAreaElement>(null);
  const inputTitle = useRef<HTMLInputElement>(null);
  const editorTool = useRef<any>(null);

  // 1. 에디터 초기화는 최초 한 번만
  useEffect(() => {
    const editor = initEditor("content");
    editorTool.current = editor;
    setEditorReady(true);
  }, []);

  // 2. 게시글 정보 가져오기 + 내용 에디터에 로드
  useEffect(() => {
    api.get(`/posts/${postId}`).then(res => {
      setTitle(res.data.title);
      setWriter(res.data.writer);
      setUploadFileName(res.data.uploadFile);
      console.log(res.data);
      if (inputContent.current) inputContent.current.value = res.data.content;

      // SmartEditor가 초기화 완료된 후에만 exec
      const checkReadyAndLoad = setInterval(() => {
        if (editorTool.current) {
          editorTool.current.exec("LOAD_CONTENTS_FIELD", [res.data.content]);
          clearInterval(checkReadyAndLoad);
        }
      }, 100);
    });
  }, [postId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editorTool.current) {
      alert("에디터가 아직 초기화되지 않았습니다.");
      return;
    }

    editorTool.current.exec("UPDATE_CONTENTS_FIELD", []); // 에디터 내용을 textarea로 반영

    const formData = new FormData();
    formData.append('title', inputTitle.current?.value || '');
    formData.append('writer', writer);
    formData.append('content', inputContent.current?.value || '');
    if (uploadFile) {
      formData.append('uploadFile', uploadFile);
    }

    api.patch(`/posts/${postId}`, formData)
      .then(() => {
        alert('수정 완료!');
        navigate(`/posts/${postId}`);
      })
      .catch(() => {
        alert('수정 실패');
      });
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">공지 수정</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label><strong>제목</strong></Form.Label>
          <Form.Control
            ref={inputTitle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목 입력"
          />
        </Form.Group>
        <Form.Group as={Row} className="mb-3 align-items-center">
          <Form.Label column md={2}><strong>파일 첨부</strong></Form.Label>
          <Col>
            <Form.Control
              type="file"
              onChange={(e) => {
                setUploadFile(e.target.files?.[0] || null);
              }}
            />
            <Form.Text muted>
              {uploadFileName && !uploadFile && `기존 파일: ${uploadFileName}`}
            </Form.Text>
          </Col>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label><strong>내용</strong></Form.Label>
          <textarea ref={inputContent} id="content" className="form-control" rows={10}></textarea>
        </Form.Group>

        <div className="text-end">
          <Button type="submit" variant="primary" disabled={!editorReady}>수정</Button>
        </div>
      </Form>
    </Container>
  );
}

export default PostEdit;
