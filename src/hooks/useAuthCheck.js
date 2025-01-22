import { useState, useEffect} from 'react';
import { getUserProfile } from '../api/userApi';
import Swal from 'sweetalert2';
import "../styles/swal2-style.css";

export function useAuthCheck(){
    const [isAuthenticated, setIsAuthenticated] =useState(false);
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const checkAuth = async () =>{
            try{
                const authData = await getUserProfile();
                if(!authData.success){
                    Swal.fire({
                        title: '알림',
                        text: '로그인을 해주세요!',
                        icon: 'warning',
                        confirmButtonText: '확인'
                      }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/';
                        }
                    });
                    setIsAuthenticated(false);
                } else{
                    setIsAuthenticated(true);
                    setUser(authData);
                }
            } catch(error){
                console.error("사용자 정보를 가져오는 중 오류 발생:", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    },[]);

    return { isAuthenticated, user};
}