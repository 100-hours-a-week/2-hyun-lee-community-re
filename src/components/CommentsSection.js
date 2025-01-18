import React, { useState } from "react";
import Swal from 'sweetalert2';
import { addComment, deleteComment, updateComment } from "../api/postApi";
import { formatDate } from "../utils/formatDate";
import ConfirmationModal from "./ConfirmationModal";
import { Card, Button, Form, Row, Col, Image } from "react-bootstrap";
import "../styles/swal2-style.css";

const CommentsSection = ({ comments, postId, setComments, user, setCommentCount }) => {
    const [commentContent, setCommentContent] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [modalContent, setModalContent] = useState({});

    const handleAddComment = async () => {
      if (!commentContent.trim()) {
        Swal.fire({
          title: '댓글 내용 입력',
          text: '댓글 내용을 입력해주세요.',
          icon: 'warning', 
          confirmButtonText: '확인'
        });
      
        return;
      }
  
      try {
        if(isEditing){

            const updatedComment = await updateComment(postId,editingCommentId,commentContent);
            console.log(updatedComment);
            setComments((prev)=> prev.map((comment)=> comment.comment_id === editingCommentId ?  {  ...comment,
                comment_content: updatedComment.comments[0].comment_content, 
                create_at: updatedComment.comments[0].create_at, } : comment));

            setIsEditing(false);
            setEditingCommentId(null);
        } else{
            const newComment = await addComment(postId, commentContent);
            const commentWithDetails ={
                ...newComment.comment,
                profile_image: user.userInfo.profile_image,
                nickname: user.userInfo.nickname
            }
            setComments((prev) => [...prev, commentWithDetails]);
            setCommentCount((prev) => prev + 1 );
        }
        setCommentContent("");
      } catch (error) {
        console.error("Error :", error);
      }
    };
  

    const handleDeleteComment = async (comment_id) => {
        setModalContent({
            title: "댓글 삭제",
            message: "댓글을 삭제하시겠습니까? 복구할 수 없습니다.",
            onConfirm: async () => {
              try {
                await deleteComment(postId, comment_id);
                setComments((prev) => prev.filter((comment) => comment.comment_id !== comment_id));
                setCommentCount((prev) => prev -1 );
                setIsModalOpen(false);
              } catch (error) {
                console.error("Error:", error);
              }
            },
          });
          setIsModalOpen(true);
    };

    const handleEditComment = (comment_id)=>{
        const commentToEdit = comments.find((comment)=> comment.comment_id === comment_id);
        if(commentToEdit){
            setIsEditing(true);
            setEditingCommentId(comment_id);
            setCommentContent(commentToEdit.comment_content);
        }

    }
    
  
    return (
        <Card className="comments-section my-4">
            <Card.Body>
            <Form className="mt-4 mb-3">
          <Form.Group controlId="commentTextarea">
            <Form.Control
              as="textarea"
              rows={3}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력하세요"
              className="mb-3"
            />
          </Form.Group>
          <div className="text-end">
            <Button
              variant="primary"
              onClick={handleAddComment}
              disabled={!commentContent.trim()}
            >
              {isEditing ? "댓글 수정" : "댓글 등록"}
            </Button>
          </div>
        </Form>
            {comments.map((comment) => (
          <Row key={comment.comment_id} className="comment-item mb-3">
            <Col xs="auto">
                <Image
                    src={comment.profile_image}
                    alt={`${comment.nickname}의 프로필`}
                    roundedCircle
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
            </Col>
            <Col>
            <div className="d-flex align-items-center mb-3">
              <span className="fw-bold">{comment.nickname}</span>
              <small className="text-muted ms-2">{formatDate(comment.create_at)}</small>
            </div>
              <p className="mb-1">{comment.comment_content}</p>
            </Col>
            { user.userInfo.user_id === comment.user_id && (
              <Col xs={12} md={2} className="text-end">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditComment(comment.comment_id)}
                >
                  수정
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteComment(comment.comment_id)}
                >
                  삭제
                </Button>
              </Col>
            )}
          </Row>
        ))}
        </Card.Body>
        {isModalOpen && (
        <ConfirmationModal
          show={isModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={modalContent.onConfirm}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
      </Card>
    );
  };
  
  export default CommentsSection;