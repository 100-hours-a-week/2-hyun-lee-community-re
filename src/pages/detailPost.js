import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchUserData } from "../utils/fetchUserData.js"; 

import {
    fetchPostDetails,
    fetchComments,
    deletePost,
    updatePostLikes,
    updatePostViews,
    userLikeStatus,
  } from "../api/postApi.js";
import Header from "../components/Header";
import PostHeader from "../components/PostHeader";
import CommentsSection from "../components/CommentsSection"
import ConfirmationModal from "../components/ConfirmationModal";
import { getImageUrl } from "../api/userApi";

import "../styles/detailPost-style.css";


const DetailPost = () =>{
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const post_id = params.get("post_id");
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [likeCount, setLikeCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});

    useEffect( ()=>{
        const fetchData = async () =>{
            
        
             try {
                const currentUser = await fetchUserData();
                if(currentUser) setCurrentUser(currentUser);
                const postDetails = await fetchPostDetails(post_id);
                
                console.log(postDetails.posts[0]);
                setPost(postDetails.posts[0]);
                setLikeCount(postDetails.posts[0].likes_count);
                setUserId(postDetails.user_id);
                setCommentCount(postDetails.posts[0].comment_count)
                const commentResults = await fetchComments(post_id);
                setComments(commentResults.comments);

                await updatePostViews(post_id);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        fetchData();
    },[post_id]);
    
    const handleLike = async () =>{
        try {
            const result = await userLikeStatus(post_id);
    
            const liked = result.result.is_exist;
      
            if (liked) {
              setLikeCount((prev) => prev - 1);
            } else {
              setLikeCount((prev) => prev + 1);
            }
      
            await updatePostLikes(post_id, userId);
          } catch (error) {
            console.error("Error:", error);
          }
    };
    const handleEditPost = async ()=>{
        navigate(`/edit-post?post_id=${post_id}`)
    }

    const handleDeletePost = async () => {
        setModalContent({
            title: "게시글 삭제",
            message: "게시글을 삭제하시겠습니까? 복구할 수 없습니다.",
            onConfirm: async () => {
              try {
                await deletePost(post_id);
                navigate("/board");
              } catch (error) {
                console.error("Error:", error);
              }
            },
          });
          setIsModalOpen(true);
    };
    

    



    return (
        <>
        <Header title="아무말 대잔치" profileImage={currentUser ? getImageUrl(currentUser.userInfo.profile_image) : null} onBack={()=> navigate("/board")} />
        <div className="post-container">
        {post && (
          <PostHeader
            post={post}
            likeCount={likeCount}
            handleLike={handleLike}
            userId={userId}
            handleDeletePost={handleDeletePost}
            handleEditPost ={handleEditPost}
            commentCount= {commentCount}
          />
        )}
         <CommentsSection
          comments={comments}
          postId={post_id}
          setComments={setComments}
          setCommentCount={setCommentCount}
          user={currentUser}
        />
        </div>
        {isModalOpen && (
        <ConfirmationModal
          show={isModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={modalContent.onConfirm}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
        </>
    )
    

}

export default DetailPost;