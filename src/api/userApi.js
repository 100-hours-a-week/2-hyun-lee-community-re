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



export async function getUserProfile(){
    const response = await fetch(`${BASE_URL}/user/profile`,{
        method :'GET',
        credentials: 'include'
    })
    return response.json();
}

export function getImageUrl(image){
    if(!image || image.trim()===''){
        return '';
    }
    return `${image}`;
}

export async function logout(){
    const response =await fetch(`${BASE_URL}/users/logout`,{
        method :'GET',
        credentials: 'include'
    });
    return response.json();
}

export async function updateUserProfile(formData) {
    const response = await fetch(`${BASE_URL}/user/profile`,{
        method:'PATCH',
        body: formData,
        credentials: 'include'
    });
    return response.json();
    
}


export async function deleteUserAccount(user_id){
    const response = await fetch(`${BASE_URL}/user/${user_id}`,{
        method:'DELETE',
        credentials: 'include'
    });
    return response.json();
}   



export async function updateUserPassword(formData){
    const response = await fetch(`${BASE_URL}/user/password`,{
        method:'PATCH',
        body: formData,
        credentials: 'include'
    });
    return response.json();
}   
