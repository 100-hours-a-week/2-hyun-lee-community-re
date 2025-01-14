function getBaseUrl() {
    const hostname = window.location.hostname;
    if (hostname === 'localhost') {
      return 'http://localhost:3001/api'; 
    } else if (hostname === 'communityapp-env.eba-6tkf3pgq.ap-northeast-2.elasticbeanstalk.com') {
        return 'http://communityapp-env.eba-6tkf3pgq.ap-northeast-2.elasticbeanstalk.com/api';
      } else {
        return 'http://52.78.32.212:3001/api'; 
      }
  }
  
const BASE_URL = getBaseUrl();
const CDN_URL = 'https://d2m8tt5bgy55i.cloudfront.net/';
const S3_URL = 'https://s3.ap-northeast-2.amazonaws.com/hyun.lee.bucket/';
  



// 사용자 인증 관련
export async function login(email,password){
    const response = await fetch(`${BASE_URL}/users/login`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'  
        },    
        credentials: 'include',
        body: JSON.stringify({email, password}),
    });

    const result= await response.json();
    console.log(result);
    return result;
}


export async function checkEmailExists(email) {
    try {
        const encodedEmail = encodeURIComponent(email);
        const response = await fetch(`${BASE_URL}/users/email/check?email=${encodedEmail}`,{
            method : 'GET',
            credentials: 'include'
        });
        return response.json();
    } catch (error) {
        console.error('이메일 중복 확인 중 오류 발생:', error);
        return true; 
    }
}


export async function checkNicknameExists(nickname) {
    try {
        const response = await fetch(`${BASE_URL}/users/nickname/check?nickname=${nickname}`,{
            method: 'GET',
            credentials: 'include'
        });
        return response.json();
    } catch (error) {
        console.error('닉네임 중복 확인 중 오류 발생:', error);
        return true; 
    }
}

export async function checkNicknameExistsForUpdate(nickname,user_id) {
    try {
        const response = await fetch(`${BASE_URL}/users/nickname/update/check?nickname=${nickname}&user_id=${user_id}`,{
            method: 'GET',
            credentials: 'include'
        });
        return response.json();
    } catch (error) {
        console.error('닉네임 중복 확인 중 오류 발생:', error);
        return true; 
    }
}


export async function registerUser(formData) {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });
    return response.json();
}

export async function logout(){
    const response =await fetch(`${BASE_URL}/users/logout`,{
        method :'GET',
        credentials: 'include'
    });
    return response.json();
}