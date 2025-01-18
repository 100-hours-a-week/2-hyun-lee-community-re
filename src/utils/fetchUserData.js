import { getUserProfile } from "../api/userApi";

export async function fetchUserData() {
    try {
  
      const userData = await getUserProfile();
      return userData;
    } catch (err) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", err);
      return null;
    }
  }