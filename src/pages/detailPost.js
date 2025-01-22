import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthCheck } from "../hooks/useAuthCheck";
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
    const { isAuthenticated, user } = useAuthCheck();  
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});

    useEffect( ()=>{
        const fetchData = async () =>{
            
        
             try {
          
                if (!isAuthenticated) return ;
                
                const postDetails = await fetchPostDetails(post_id);
                
                setPost(postDetails.posts[0]);
                setLikeCount(postDetails.posts[0].likes_count);
                setUserId(postDetails.user_id);
                setCommentCount(postDetails.posts[0].comment_count)

                const likeStatusResult = await userLikeStatus(post_id);
                const isLiked = likeStatusResult.result.is_exist;
                setLiked(isLiked);
                const commentResults = await fetchComments(post_id);
                setComments(commentResults.comments);

                await updatePostViews(post_id);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        fetchData();
    },[isAuthenticated,post_id]);
    
    const handleLike = async () =>{
        try {
            const result = await userLikeStatus(post_id);
    
            const isLikedBefore = result.result.is_exist;
            
            if (isLikedBefore) {
              setLikeCount((prev) => prev - 1);
              setLiked(false);
            } else {
              setLikeCount((prev) => prev + 1);
              setLiked(true);
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
        <Header title="구름 아래" profileImage={user ? getImageUrl(user.userInfo.profile_image) : null} onBack={()=> navigate("/board")} />
        <div className="post-container">
        {post && (
          <PostHeader
            post={post}
            likeCount={likeCount}
            liked={liked}
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
          user={user}
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