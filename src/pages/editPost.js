import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from "react-router-dom";
import { validatePostTitle, validatePostContent } from "../utils/validators";
import { fetchPostDetails, updatePost, fetchResource } from "../api/postApi";
import { escapeHtml } from "../utils/escape";
import { fetchUserData } from "../utils/fetchUserData.js"; 
import Header from "../components/Header";
import { getImageUrl } from "../api/userApi";
import { Card, Button, Form, Row ,Col } from "react-bootstrap";
import { unescapeHtml } from "../utils/escape";
import { authCheck } from "../api/authCheckApi";
import "../styles/editPost-style.css";
import "../styles/swal2-style.css";


const EditPost = () =>{
    const [user, setUser] = useState(null);
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [existingPostImage, setExistingPostImage] = useState(null);
    const [CurrentPostImage, setCurrentPostImage] = useState(null);
    const [existingFileName, setExistingFileName] = useState("이미지를 선택하세요.");
    const [currentFileName, setCurrentFileName] = useState("이미지를 선택하세요.");
    const [titleError, setTitleError] = useState("");
    const [contentError, setContentError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const postId = params.get("post_id");

    const isFormValid = postTitle && postContent && !titleError && !contentError;

    useEffect(() => {
        const fetchData = async () =>{

            
        
        try{

            const isAuthenticated = await authCheck();
            if (!isAuthenticated) return ;

            const userInfo = await fetchUserData();
            if(userInfo) setUser(userInfo);
            const postData = await fetchPostDetails(postId);
            const post = postData.posts[0];
            if(userInfo.userInfo.user_id !== post.user_id) {
                alert("권한이 없습니다!");
                navigate("/board");
                return ;
            }
            setPostTitle(unescapeHtml(post.post_title));
            setPostContent(unescapeHtml(post.post_content));

            if (post.post_image) {
                const response = await fetchResource(post.post_image);
                const blob = await response.blob();
                const fileName = decodeURIComponent(post.post_image.match(/[^-]+$/)[0]);
                setExistingFileName(fileName);
                setCurrentFileName(fileName);
                setCurrentPostImage(new File([blob], fileName, { type: blob.type }));
                setExistingPostImage(new File([blob], fileName, { type: blob.type }));
              }
       
         } catch (err) {
            console.error("게시글 데이터를 불러오는 중 오류가 발생했습니다:", err);
  
        }
        }
        fetchData();
    }, [postId]);

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
        if (file) {

          if(file.size > maxSize){
            Swal.fire({
              title: '파일 크기 초과',
              text: '파일의 크기는 1MB를 초과할 수 없습니다.',
              icon: 'error',
              confirmButtonText: '확인'
            });
            return ;
          }
          if(file.name.length > maxFileNameLength){
            Swal.fire({
              title: '파일 이름 제한',
              text: `파일 이름은 최대 ${maxFileNameLength}글자까지 가능합니다.`,
              icon: 'error',
              confirmButtonText: '확인'
            });
            return ;
          }
          setCurrentPostImage(file);
          setCurrentFileName(file.name);
        } else{
            setCurrentPostImage(existingPostImage);
            setCurrentFileName(existingFileName);
        }
    };


    const handleDeleteImage = () => {
        setCurrentPostImage(null);
        setCurrentFileName("이미지를 선택하세요.");
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if(isFormValid){
    
        const formData = new FormData();
        formData.append("postTitle", escapeHtml(postTitle));
        formData.append("postContent", escapeHtml(postContent));
    
    
        if (CurrentPostImage) {
          formData.append("postImage", CurrentPostImage);
          formData.append("postDelete", false);
        } else {
          formData.append("postDelete", true);
        }
    
        try {
          const response = await updatePost(formData, postId);
          if (response.success) {
            navigate(`/post?post_id=${postId}`);
          } else {
            alert("게시글 수정에 실패했습니다.");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
        }
      };

    const handleBack = () => {
        navigate(-1); 
      }
    
      return (
        <>
         <Header title="구름 아래" profileImage={user ? getImageUrl(user.userInfo.profile_image) : null} onBack={handleBack} />
         <Card id="custom-card" className="post-header-card custom-class-card" >
         <Row className="d-flex flex-column align-items-center">
            <Col>
                <h2 className="text-center m-4">게시글 수정</h2>
                <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="postTitle">
                    <Form.Label>제목*</Form.Label>
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
    
                <Form.Group className="mb-3" >
                <div className="d-flex align-items-center mb-2">
                <Button
                  variant="dark"
                  className="me-3"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                    이미지 선택
                </Button>
                <span className="file-name-box">{currentFileName}</span>
                <Form.Control
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                </div>
                <>
                    {CurrentPostImage ? (
                        <Button
                        variant="danger"
                        className="mb-3"
                        onClick={handleDeleteImage}
                        >
                        이미지 삭제
                        </Button>
                    ) : (
                        <div
                        className="mb-3"
                        style={{
                            visibility: "hidden", 
                            height: "38px",       
                            width: "99.39px",       
                        }}
                        />
                    )}
                    </>
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
    
export default EditPost;
    