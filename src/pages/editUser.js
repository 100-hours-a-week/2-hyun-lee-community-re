import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  updateUserProfile, deleteUserAccount } from "../api/userApi";
import { deleteUserComments, deleteUserPosts } from "../api/postApi";
import { validateNickname } from "../utils/validators";
import { escapeHtml } from "../utils/escape";
import { getImageUrl } from "../api/userApi";
import ConfirmationModal from "../components/ConfirmationModal";
import { fetchUserData } from "../utils/fetchUserData"
import ProfileImageUpload from "../components/ProfileImageUpload";
import Header from "../components/Header";
import { Card, Row, Col, Form, Button } from "react-bootstrap";

const EditUser = () =>{
    const [user, setUser]= useState(null);
    const [nickname, setNickname] = useState("");
    const [existingProfileImage, setExistingProfileImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    
    const [nicknameError, setNicknameError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const navigate = useNavigate();

    const isFormValid =  nickname && !nicknameError;

    useEffect (()=>{
        const fetchData = async ()=>{
            try {
                const userInfo = await fetchUserData();
                if (userInfo && userInfo.userInfo) {
                    setUser(userInfo);
                    setNickname(userInfo.userInfo.nickname); 
                    setExistingProfileImage(userInfo.userInfo.profile_image);
                    setProfileImage(userInfo.userInfo.profile_image)
                } 
            } catch (error) {
                console.error("Error :", error);
            }
        }

        fetchData();
    },[]);
    

    const handleNicknameChange = (e) =>{
        const value = e.target.value;
        setNickname(value);

        const { valid, message } = validateNickname(value);
        setNicknameError(valid ? "" : message);
    }

    const handleProfileImageChange = (image) =>{
        setProfileImage(image);
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(isFormValid){
            
            const formData = new FormData();
            formData.append("nickname",escapeHtml(nickname));
            formData.append("profileImage",profileImage);
            formData.append('user_id',user.userInfo.user_id);


            try{
                const response = await updateUserProfile(formData);
                if(!response.success){
                    if(response.message.includes("중복된 닉네임 입니다.")){
                        setNicknameError("*중복된 닉네임입니다.");
                    } else{
                        alert("회원 정보 수정 실패");
                    }
                } else{
                    alert(response.message);
                    navigate("/board");
                    
                }
            } catch (error) {
                console.error("Error :", error);
              }
        
        }

    }

    const handleWithdraw = () => {
        setIsModalOpen(true);
    };

    const handleConfirmWithdraw = async () => {
        try {
          await deleteUserComments(user.userInfo.user_id);
          await deleteUserPosts(user.userInfo.user_id);
          await deleteUserAccount(user.userInfo.user_id);
          alert("회원 탈퇴가 완료되었습니다.");
          navigate("/");
        } catch (error) {
          console.error("Error:", error);
          alert("회원 탈퇴에 실패했습니다.");
        }
        setIsModalOpen(false);
      };

    const handleBack = () =>{
        navigate("/board");
    }

      return (
        <>
        <Header title="아무말 대잔치" profileImage={user ? getImageUrl(user.userInfo.profile_image) : null} onBack={handleBack} />
        <Card id="custom-card" className="post-header-card custom-class-card" >
        <Row className="d-flex justify-content-center align-items-center">
            <Col xs={6}>
                <h2 className="text-center m-4">회원 정보 수정</h2>
                <Row>
                <Form onSubmit={handleSubmit}>
                
                <Form.Group className="mb-3" controlId="profileImage">
                  <ProfileImageUpload
                    onImageChange={handleProfileImageChange}
                    existingImage={existingProfileImage}
                  />
                </Form.Group>
    
                <Form.Group className="mb-3">
                    <Form.Label>닉네임*</Form.Label>
                    <Form.Control
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={handleNicknameChange}
                        isInvalid={!!nicknameError}
                        className="form-control-lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      {nicknameError}
                    </Form.Control.Feedback>
                </Form.Group>
    
                <Row className="mb-3">
              <Col className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!isFormValid}
                  className="w-50"
                >
                  수정하기
                </Button>
              </Col>
            </Row>

            <Row>
              <Col className="d-flex justify-content-center">
                <Button
                  variant="danger"
                  onClick={handleWithdraw}
                  className="w-50"
                >
                  회원탈퇴
                </Button>
              </Col>
              </Row>
            </Form>
          </Row>
          {isModalOpen && (
            <ConfirmationModal
              show={isModalOpen}
              title="회원탈퇴"
              message="작성된 게시글과 댓글은 모두 삭제됩니다."
              onConfirm={handleConfirmWithdraw}
              onCancel={() => setIsModalOpen(false)}
            />
          )}
          </Col>
          </Row>
        </Card>
        </>
      );
};


export default EditUser;
    