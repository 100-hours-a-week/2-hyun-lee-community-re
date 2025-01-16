import React, { useState } from "react";
import ProfileImageUpload from "../components/ProfileImageUpload";
import Header from "../components/Header";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { validateProfile, validateEmail, validateNickname, validateConfirmPassword, validatePassword } from "../utils/validators";
import { escapeHtml } from "../utils/escape";
import { registerUser } from "../api/registerApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const [emailError, setEmailError] = useState("*이메일을 입력해주세요.");
  const [passwordError, setPasswordError] = useState("*비밀번호를 입력해주세요.");
  const [confirmPasswordError, setConfirmPasswordError] = useState("*비밀번호를 한 번 더 입력해주세요.");
  const [nicknameError, setNicknameError] = useState("*닉네임을 입력해주세요.");
  const [profileImageError, setProfileImageError] = useState("*프로필 사진을 추가해주세요.");

  const isFormValid =
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    !nicknameError &&
    !profileImageError;

  const navigate = useNavigate();
  
  const handleProfileImageChange = (image) => {
    setProfileImage(image);
    const { valid, message } = validateProfile(image);
    setProfileImageError(valid ? "" : message);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const { valid, message } = validateEmail(value);
    setEmailError(valid ? "" : message);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const { valid, message } = validatePassword(value);
    setPasswordError(valid ? "" : message);

    if (confirmPassword) {
      const { valid: confirmValid, message: confirmMessage } = validateConfirmPassword(value, confirmPassword);
      setConfirmPasswordError(confirmValid ? "" : confirmMessage);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    const { valid, message } = validateConfirmPassword(password, value);
    setConfirmPasswordError(valid ? "" : message);
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);

    const { valid, message } = validateNickname(value);
    setNicknameError(valid ? "" : message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      const formData = new FormData();
      formData.append("profileImage",profileImage);
      formData.append("email",email);
      formData.append("password",password);
      formData.append("confirmPassword",confirmPassword);
      formData.append("nickname",escapeHtml(nickname));

      try{
        const response = await registerUser(formData);
        if(response.success){
            console.log("회원가입 성공", response.message);
            window.location.href="/";
        } else {
            if (response.message.includes("중복된 이메일 입니다.")) {
              setEmailError("*중복된 이메일입니다.");
            }
            if (response.message.includes("중복된 닉네임 입니다.")) {
              setNicknameError("*중복된 닉네임입니다.");
            }
          }
       } catch (error) {
        console.error("Error:", error);
        alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
       }
    };
   }

   const handleBack = () =>{
      navigate("/");
   }
   return (
    <>
      <Header title="구름 아래" onBack={handleBack}/>
      <Card id="custom-card" className="post-header-card custom-class-card">
        <Row className="d-flex justify-content-center align-items-center">
          <Col xs={6}>
            <h2 className="text-center m-4">회원 가입</h2>
            <Row>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <ProfileImageUpload onImageChange={handleProfileImageChange} />
                  {profileImageError && (
                    <div className="text-danger">{profileImageError}</div>
                  )}
                </Form.Group>
  
                <Form.Group className="mb-2" controlId="email">
                  <Form.Label>이메일*</Form.Label>
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
  
                <Form.Group className="mb-2" controlId="password">
                  <Form.Label>비밀번호*</Form.Label>
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
  
                <Form.Group className="mb-2" controlId="confirmPassword">
                  <Form.Label>비밀번호 확인*</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    isInvalid={!!confirmPasswordError}
                    className="form-control-lg"
                  />
                  <Form.Control.Feedback type="invalid">
                    {confirmPasswordError}
                  </Form.Control.Feedback>
                </Form.Group>
  
                <Form.Group className="mb-2" controlId="nickname">
                  <Form.Label>닉네임*</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    value={nickname}
                    onChange={handleNicknameChange}
                    isInvalid={!!nicknameError}
                    className="form-control-lg"
                  />
                  <Form.Control.Feedback type="invalid">
                    {nicknameError}
                  </Form.Control.Feedback>
                </Form.Group>
  
                <Col className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-50 mb-3"
                    disabled={!isFormValid}
                  >
                    회원가입
                  </Button>
                </Col>
              </Form>
  
              <Col className="d-flex justify-content-center">
                <Button
                  variant="success"
                  className="w-50"
                  onClick={() => navigate("/")}
                >
                  로그인하러가기
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </>
  );
  
};

export default Register;
