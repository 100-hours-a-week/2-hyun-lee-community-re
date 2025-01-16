import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";

const ProfileImageUpload = ({ onImageChange, existingImage }) => {
  const canvasRef = useRef(null);

  const [previewImage, setPreviewImage] = useState(null);

  const drawPlusSign = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 2;

    ctx.moveTo(canvas.width / 2, canvas.height / 4);
    ctx.lineTo(canvas.width / 2, (3 * canvas.height) / 4);

    ctx.moveTo(canvas.width / 4, canvas.height / 2);
    ctx.lineTo((3 * canvas.width) / 4, canvas.height / 2);

    ctx.stroke();
  };

  const loadImageToCanvas = (imageSrc) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = imageSrc;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 1 * 1024 * 1024 ;
    if (file) {
      if(file.size > maxSize){
        alert("파일의 크기는 1MB를 초과 할 수 없습니다.");
        return ;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        onImageChange(file);
      };
      reader.readAsDataURL(file);
    } else {
        setPreviewImage(null);  
        onImageChange(null); 
      }
    }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (previewImage) {
      loadImageToCanvas(previewImage); 
    } else if (existingImage) {
      loadImageToCanvas(existingImage); 
    } else {
      drawPlusSign(ctx, canvas); 
    }
  }, [previewImage, existingImage]); 

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>프로필 사진*</Form.Label>
        <div className="profile-upload-wrapper d-flex justify-content-center align-itesms-center">
          <label htmlFor="profileImage" className="circle">
            <canvas
              ref={canvasRef}
              id="profileCanvas"
              width="100"
              height="100"
              style={{
                borderRadius: "50%",
                border: "2px solid #ccc",
                cursor: "pointer",
              }}
            ></canvas>
          </label>
        </div>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="profileImage"
        />
      </Form.Group>
    </>
  );
};

export default ProfileImageUpload;
