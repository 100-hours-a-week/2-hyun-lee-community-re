import { getUserProfile } from "./userApi";

export async function authCheck(){
    const authData = await getUserProfile();
    if (!authData.success) {
        alert("로그인을 해주세요!");
        window.location.href = '/';
        return false; 
        }
        return true; 
    }
    