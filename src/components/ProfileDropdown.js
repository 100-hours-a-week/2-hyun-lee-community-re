import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/userApi";
import "../styles/profileDropdown-style.css";
const ProfileDropdown = ({avatar}) =>{
    const navigate = useNavigate();

    const handleEditUser = () => navigate("/edit-user");
    const handleEditPassword = () => navigate("/edit-user-password");
    const handleLogout = async() => {
        const result= await logout();
        if(result.success){
            navigate("/");
        } 
    }

    return (
        <Dropdown align="end" className="profile-dropdown">
            <Dropdown.Toggle
                id ="dropdown-basic"
                className="profile-toggle"
            >
                <img
                    src={avatar}
                    alt="프로필"
                    className="rounded-circle profile-avatar"
                />
            </Dropdown.Toggle>
            <Dropdown.Menu className="profile-menu">
                <Dropdown.Item onClick={handleEditUser}>회원정보수정</Dropdown.Item>
                <Dropdown.Item onClick={handleEditPassword}>비밀번호수정</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} className="text-danger">로그아웃</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ProfileDropdown;