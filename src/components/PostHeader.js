import React from "react";
import { formatCount } from "../utils/formatCount";
import { formatDate } from "../utils/formatDate";
import { Card, Row, Col, Image } from "react-bootstrap";
import "../styles/postHeader-style.css"; 
import { unescapeHtml } from "../utils/escape";
const PostHeader = ({ post, likeCount, liked, handleLike, userId, handleDeletePost, handleEditPost, commentCount }) => {
    const profileImageUrl = post.profile_image;
    const postImageUrl = post.post_image;

    return (
        <Card className="post-header-card">
            {userId === post.user_id && (
                <div className="post-header-actions">
                    <button onClick={handleEditPost} className="btn btn-outline-primary me-2">
                        수정
                    </button>
                    <button onClick={handleDeletePost} className="btn btn-outline-danger">
                        삭제
                    </button>
                </div>
            )}
            <Card.Body>
                <Row className="align-items-center mb-3">
                    <Col xs="auto">
                        <Image
                            src={profileImageUrl}
                            alt="작성자 프로필"
                            className="post-header-avatar"
                        />
                    </Col>
                    <Col>
                        <h5 className="post-header-author">{post.nickname}</h5>
                        <small className="post-header-date">{formatDate(post.create_at)}</small>
                    </Col>
                </Row>

                <Card.Title as="h3" className="post-header-title">{unescapeHtml(post.post_title)}</Card.Title>


                {postImageUrl && (
                    <div>
                        <Image
                            src={postImageUrl}
                            alt="게시글 이미지"
                            className="post-header-image"
                        />
                    </div>
                )}

                <Card.Text className="post-header-content">{unescapeHtml(post.post_content)}</Card.Text>

                <Row>
                    <Col>
                        <div id="like-item" className="stat-item" onClick={handleLike}>
                        <span className="stat-number">{likeCount}</span>
                        <img
                            src={liked ? "/images/like2.png" : "/images/like1.png"}
                            alt="좋아요 아이콘"
                        />
                        </div>
                    </Col>
                    <Col>
                        <div className="stat-item">
                        <span className="stat-number">{formatCount(post.view_count)}</span>
                        <img src="/images/views.png" alt="조회수 아이콘" />
                        </div>
                    </Col>
                    <Col>
                        <div className="stat-item">
                        <span className="stat-number">{formatCount(commentCount)}</span>
                        <img src="/images/comments.png" alt="댓글 아이콘" />
                        </div>
                    </Col>
                </Row>

            </Card.Body>
        </Card>
    );
};

export default PostHeader;
