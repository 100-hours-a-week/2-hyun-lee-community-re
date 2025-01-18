import { getUserProfile } from "./userApi";
import Swal from 'sweetalert2';
import "../styles/swal2-style.css";
export async function authCheck(){
    const authData = await getUserProfile();
    if (!authData.success) {
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
          return false; 
        }
        return true; 
    }
    