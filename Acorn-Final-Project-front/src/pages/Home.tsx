import api from '@/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function Home() {
    const navigate = useNavigate();
    const [id, setId] =useState('');
    const [pw, setUserPassword] =useState('');
    const dispatch = useDispatch();
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        api.post('/login', {
            id: id,
            pw: pw
        }).then((res) => {
            if(res.data.cdRole === 'CEO' || res.data.cdRole === 'ADMIN'){
                localStorage.setItem('user', JSON.stringify({
                    userId: res.data.userId,
                    userName: res.data.userName,
                    storeName: res.data.storeName,
                    cdRole: res.data.cdRole
                }));

                // Redux에도 바로 반영
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        userInfo: {
                            userId: res.data.userId,
                            userName: res.data.userName,
                            storeName: res.data.storeName,
                            cdRole: res.data.cdRole
                        }
                    }
                });

                navigate(res.data.cdRole === 'CEO' ? '/ceo' : '/admin');
            }else{
                alert('아이디 또는 비밀번호가 틀렸습니다.');
            }
        });
    };

    return (
        <>
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="card shadow p-4" style={{ width: '100%', maxWidth: '600px' }}>
                    <h2 className="text-center mb-4">학원 관리 ERP 시스템 로그인</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="userId" className="form-label">아이디</label>
                            <input
                                type="text"
                                className="form-control"
                                id="id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder="아이디를 입력하세요"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userPassword" className="form-label">비밀번호</label>
                            <input
                                type="password"
                                className="form-control"
                                id="pw"
                                value={pw}
                                onChange={(e) => setUserPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" onClick={handleLogin}>로그인</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Home;