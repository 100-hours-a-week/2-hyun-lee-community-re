import React, { useEffect, useState } from "react";
import { fetchPosts } from "../api/postApi";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PostList from "../components/PostList";
import { Card, Row, Col, Button } from "react-bootstrap";
import { getImageUrl } from "../api/userApi";
import { fetchUserData } from "../utils/fetchUserData"
import { authCheck } from "../api/authCheckApi";
import "../styles/board-style.css";


const Board = () =>{
    const [posts, setPosts] =useState([]);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    

    useEffect(()=>{
        const fetchData = async () =>{

            try{
                const isAuthenticated = await authCheck();
                if (!isAuthenticated) return ;
                
                const userInfo = await fetchUserData();
                if(userInfo) setUser(userInfo);

            const response = await fetchPosts();

            if(Array.isArray(response.posts) && response.posts.length !== 0){
                setPosts(response.posts);
            }
          } catch (err) {
            console.error("게시글 데이터를 불러오는 중 오류가 발생했습니다:", err);
      
          }

        };
        fetchData();
          
    },[navigate]);

    const handleCreatePost = () =>{
        navigate("/create-post");
    }
    return (
        <>
        <Header title="구름 아래" profileImage={user ? getImageUrl(user.userInfo.profile_image) : null} />
        <Card id="custom-card"className="post-header-card">
        <Row className="custom-row align-items-center custom-container ">
            <Col xs={12}>
                <h1 className="custom-heading">안녕하세요 <br></br>구름 아래게시판입니다.</h1>
            </Col>
            <Col xs={12} className="d-flex justify-content-end">
                <Button
                    variant="dark"
                    onClick={handleCreatePost}
                    className="custom-button"
                >
                    게시글 작성
                </Button>
            </Col>
        
        <PostList posts={posts} />
        </Row>
    </Card>
      </>
    );
}

export default Board;