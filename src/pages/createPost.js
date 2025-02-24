import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { validatePostTitle, validatePostContent } from "../utils/validators.js";
import { createPost } from "../api/postApi.js";
import { escapeHtml } from "../utils/escape";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../api/userApi";
import Header from "../components/Header";
import {Card, Button, Form, Row, Col} from "react-bootstrap";
import { useAuthCheck } from "../hooks/useAuthCheck";
import "../styles/createPost-style.css";
import "../styles/swal2-style.css";


const CreatePost = () =>{
    const { isAuthenticated, user } = useAuthCheck();  
    const [postTitle, setPostTitle] =useState("");
    const [postContent, setPostContent] = useState("");
    const [postImage, setPostImage] = useState(null);
    const [titleError, setTitleError] = useState("*제목을 입력해주세요.");
    const [contentError, setContentError] = useState("*내용을 입력해주세요.");
    const navigate = useNavigate();

    const isFormValid = postTitle && postContent && !titleError && !contentError;

    useEffect(()=>{
        const fetchUser = async () =>{
          if(!isAuthenticated) return;
        }
        fetchUser();
    },[isAuthenticated]);
    const handleTitleChange = (e) => {
        const value = e.target.value;
        setPostTitle(value);

        const {valid, message} = validatePostTitle(value);
        setTitleError(valid ? "" : message);
      };

      const handleContentChange = (e) => {
        const value = e.target.value;
        
        setPostContent(value);

        const {valid, message} = validatePostContent(value);

        setContentError(valid ? "" : message);
      };
    
      const handleImageChange = (e) => {
        const file = e.target.files[0];
        const maxSize = 1 * 1024 * 1024 ;
        const maxFileNameLength =50;
        if(file){
        if(file.size > maxSize){
          Swal.fire({
            title: '파일 크기 초과',
            text: '파일의 크기는 1MB를 초과할 수 없습니다.',
            icon: 'error',
            confirmButtonText: '확인'
          });
          e.target.value = "";
          return ;
        }
        if(file.name.length > maxFileNameLength){
          Swal.fire({
            title: '파일 이름 제한',
            text: `파일 이름은 최대 ${maxFileNameLength}글자까지 가능합니다.`,
            icon: 'error',
            confirmButtonText: '확인'
          });
          e.target.value = "";
          return ;
        }

        setPostImage(file);
      }
      };

      const handleBack = () => {
        navigate(-1); 
      }
      const handleSubmit = async (e) =>{
        e.preventDefault();
        
        if(isFormValid){
            const formData = new FormData();
            formData.append("postTitle",escapeHtml(postTitle));
            formData.append("postContent",escapeHtml(postContent));
            if (postImage) {
                formData.append("postImage", postImage);
              }
            try{
                const response = await createPost(formData);
                   if(response.success){
                     navigate(`/post?post_id=${response.post.post_id}`);
                 } else{
                     navigate('/create-post');
                     }
            } catch(error){
                console.error('Error:',error);
            }
              console.log("게시물 등록 완료");
        }

      };

      return (
        <>
         <Header title="구름 아래" profileImage={user ? getImageUrl(user.userInfo.profile_image) : null} onBack={handleBack} />
          <Card id="custom-card" className="post-header-card custom-class-card" >
            <Row className="d-flex flex-column align-items-center">
              <Col>
                <h2 className="text-center m-4">게시글 작성</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="postTitle">
                    <Form.Label className>제목*</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="제목을 입력해주세요 (최대 26글자)"
                      value={postTitle}
                      onChange={handleTitleChange}
                      isInvalid={!!titleError}
                      className="form-control-lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      {titleError}
                    </Form.Control.Feedback>
                  </Form.Group>
    
                  <Form.Group className="mb-3" controlId="postContent">
                    <Form.Label>내용*</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="내용을 입력하세요"
                      value={postContent}
                      onChange={handleContentChange}
                      isInvalid={!!contentError}
                      className="form-control-lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      {contentError}
                    </Form.Control.Feedback>
                  </Form.Group>
    
                  <Form.Group className="mb-3" controlId="postImage">
                    <Form.Label>이미지</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="form-control-lg"
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-center mt-4">
                    <Button variant="primary" type="submit" className="w-50" disabled={!isFormValid}>완료</Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card>
        </>
      );
    };
    
    export default CreatePost;