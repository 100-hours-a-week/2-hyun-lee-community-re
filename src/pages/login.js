import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validators.js";
import {Row, Col, Button, Form, Card} from "react-bootstrap";
import "../styles/login-style.css"
import { login } from "../api/registerApi";
const Login = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const isFormValid = email && password && !emailError && !passwordError;

    const navigate = useNavigate();

    const handleEmailChange = (e) =>{
        const value = e.target.value;
        setEmail(value);

        const { valid, message } = validateEmail(value);
        setEmailError(valid ? "" : message);
    };

    const handlePasswordChange = (e) =>{
        const value =e.target.value;
        setPassword(value);
        
        const { valid, message } = validatePassword(value);
        setPasswordError(valid ? "" : message);

    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(isFormValid){
            try {
                const response = await login(email, password);
        
                if (response.message ==="*비밀번호가 다릅니다.") {
                   setPasswordError("*비밀번호가 다릅니다.")
                } else if(response.message ==="*이메일이 존재하지않습니다."){
                    setEmailError("*이메일이 존재하지않습니다.")
                } else{
                    window.location.href='board';
                }
            } catch (error) {
                console.error('로그인 요청 중 오류 발생:', error);
                alert('로그인 중 오류가 발생하였습니다. 다시 시도해주세요.');
             }
        }
    };

    return (
        <>
          <Header title="구름 아래" />
          <Card id="custom-card" className="post-header-card custom-class-card">
            <Row className="d-flex justify-content-center align-items-center">
              <Col xs={6}>
                <h2 className="text-center m-4">로그인</h2>
                <Row>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>이메일</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="이메일을 입력하세요"
                        value={email}
                        onChange={handleEmailChange}
                        isInvalid={!!emailError}
                        className="form-control-lg"
                      />
                        <Form.Control.Feedback type="invalid" className="text-nowrap">
                            {emailError}
                        </Form.Control.Feedback>

                    </Form.Group>
      
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>비밀번호</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={handlePasswordChange}
                        isInvalid={!!passwordError}
                        className="form-control-lg"
                      />
                      <Form.Control.Feedback type="invalid">
                        {passwordError}
                      </Form.Control.Feedback>
                    </Form.Group>
      
                    <Col className="d-flex justify-content-center">
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-50 mb-3"
                        disabled={!isFormValid}
                      >
                        로그인
                      </Button>
                    </Col>
                  </Form>
      
                  <Col className="d-flex justify-content-center">
                    <Button
                      variant="success"
                      className="w-50"
                      onClick={() => navigate("/register")} 
                    >
                      회원가입
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </>
      );
      
    };
    
    export default Login;
    