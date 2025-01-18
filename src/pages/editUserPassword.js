import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { fetchUserData } from "../utils/fetchUserData"
import { useNavigate } from "react-router-dom";
import { validatePassword, validateConfirmPassword  } from "../utils/validators";
import { updateUserPassword, logout } from "../api/userApi";
import { getImageUrl } from "../api/userApi";
import Header from "../components/Header";
import { authCheck } from "../api/authCheckApi";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import "../styles/swal2-style.css";

const EditUserPassword = () =>{
    const [user, setUser]= useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [newPasswordError, setNewPasswordError] = useState("*비밀번호를 입력해주세요.");
    const [confirmPasswordError, setConfirmPasswordError] = useState("*비밀번호를 한번 더 입력해주세요.");
    

    const isFormValid =  newPassword && !newPasswordError && newPassword && !confirmPasswordError;

    const navigate = useNavigate();
    
    useEffect (()=>{
        const fetchData = async ()=>{
            try {

                const isAuthenticated = await authCheck();
                if (!isAuthenticated) return ;

                const userInfo = await fetchUserData();
                if (userInfo && userInfo.userInfo) {
                    setUser(userInfo);
                } 
            } catch (error) {
                console.error("Error :", error);
            }
        }

        fetchData();
    },[]);

    const handlePasswordChange = (e) =>{
        const value = e.target.value;
        setNewPassword(value);
        const { valid, message } = validatePassword(value);
        setNewPasswordError(valid ? "" : message);
    
        if (confirmPassword) {
          const { valid: confirmValid, message: confirmMessage } = validateConfirmPassword(value, confirmPassword);
          setConfirmPasswordError(confirmValid ? "" : confirmMessage);
        }
    }

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
    
        const { valid, message } = validateConfirmPassword(newPassword, value);
        setConfirmPasswordError(valid ? "" : message);
      };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isFormValid){
            
            const formData = new FormData();
            formData.append('password',newPassword);
            formData.append('confirmPassword',confirmPassword);
            formData.append('user_id',user.userInfo.user_id);

            try{
                const response = await updateUserPassword(formData);
               if(response){
                Swal.fire({
                  title: '비밀번호 변경 완료',
                  text: response.message,
                  icon: 'success',
                  confirmButtonText: '확인'
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    const logoutResult = await logout();
                    if (logoutResult.success) {
                      navigate("/");
                    } else {
                      Swal.fire({
                        title: '오류',
                        text: '로그아웃에 실패했습니다. 다시 시도해주세요.',
                        icon: 'error',
                        confirmButtonText: '확인'
                      });
                    }
                  }
                });
                
               }
            } catch (error) {
                console.error("Error :", error);
              }
        
        }

    }
    const handleBack = () =>{
        navigate(-1);
    }


    return (
        <>
          <Header 
            title="구름 아래" 
            profileImage={user ? getImageUrl(user.userInfo.profile_image) : null} 
            onBack={handleBack} 
          />
          <Card id="custom-card" className="post-header-card custom-class-card">
            <Row className="d-flex justify-content-center align-items-center">
              <Col xs={6}>
                <h2 className="text-center m-4">비밀번호수정</h2>
                <Row>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>비밀번호*</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        placeholder="비밀번호를 입력하세요"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        isInvalid={!!newPasswordError}
                        className="form-control-lg"
                      />
                      <Form.Control.Feedback type="invalid">
                        {newPasswordError}
                      </Form.Control.Feedback>
                    </Form.Group>
      
                    <Form.Group className="mb-3" controlId="ConfirmPassword">
                      <Form.Label>비밀번호 확인*</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="비밀번호를 한번 더 입력하세요"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        isInvalid={!!confirmPasswordError}
                        className="form-control-lg"
                      />
                      <Form.Control.Feedback type="invalid">
                        {confirmPasswordError}
                      </Form.Control.Feedback>
                    </Form.Group>
      
                    <Col className="d-flex justify-content-center">
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-50"
                        disabled={!isFormValid}
                      >
                        수정하기
                      </Button>
                    </Col>
                  </Form>
                </Row>
              </Col>
            </Row>
          </Card>
        </>
      );
      

}

export default EditUserPassword;