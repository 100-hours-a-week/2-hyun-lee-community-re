import React from "react";
import { useNavigate } from "react-router-dom";
import { formatCount } from "../utils/formatCount";
import { formatDate } from "../utils/formatDate";
import { Row, Col, Card, Image } from "react-bootstrap";
import { unescapeHtml } from "../utils/escape";
import "../styles/postList-style.css";
const PostItem = ({ post }) =>{
    const navigate =useNavigate();

    const handleClick = () =>{
        navigate(`/post?post_id=${post.post_id}`);
    };

    return (
      <Card
      className="post-item-card shadow-sm mb-4"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      >
      <Card.Body>
        <Card.Title className="mb-3">{unescapeHtml(post.post_title)}</Card.Title>
        <div>
            <div className="d-flex align-items-center text-muted small post-stat-item" style={{ gap: "10px" }}>
              <div className="d-flex align-items-center">
                <img src="/images/like1.png" alt="좋아요 아이콘" className="post-icon-small" />
                <span>{formatCount(post.likes_count)}</span>
              </div>
              <div className="d-flex align-items-center">
                <img src="/images/comments.png" alt="댓글 아이콘" className="post-icon-small" />
                <span>{formatCount(post.comment_count)}</span>
              </div>
              <div className="d-flex align-items-center">
                <img src="/images/views.png" alt="조회수 아이콘" className="post-icon-small" />
                <span>{formatCount(post.view_count)}</span>
              </div>
            </div>
          <div className="d-flex align-items-center mt-3">
            <Image
              src={post.profile_image}
              alt={`${post.nickname}의 프로필`}
              roundedCircle
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <div className="ms-3">
              <div className="fw-bold">{unescapeHtml(post.nickname)}</div>
              <small className="text-muted">{formatDate(post.create_at)}</small>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
    );
  };
  
const PostList = ({ posts }) => {
    return (
      <Row className="g-3 justify-content-center">
        {posts.map((post) => (
          <Col key={post.post_id} lg={11} >
            <PostItem post={post} />
          </Col>
        ))}
      </Row>
    
    )
}
export default PostList;