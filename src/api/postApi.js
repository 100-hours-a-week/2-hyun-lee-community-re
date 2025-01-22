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
  




export async function fetchPosts(){
    const response = await fetch(`${BASE_URL}/posts`,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json'  
        },
        credentials: 'include',     
    });
    return response.json();
}


export async function fetchPostDetails(post_id){
    const response = await fetch(`${BASE_URL}/posts/${post_id}`,{
        method:'GET',
        credentials: 'include'
    });
    return response.json();
}

export async function updatePostViews(post_id){
    const response = await fetch(`${BASE_URL}/posts/${post_id}`,{
        method:'PATCH',
        credentials: 'include'
    });
    return response.json();
}



export async function createPost(formData){
    const response= await fetch(`${BASE_URL}/posts`,{
        method: 'POST',
        body: formData,
        credentials: 'include'
    });
    return response.json();
}


export async function updatePost(formData,post_id) {
    const response = await fetch(`${BASE_URL}/posts/update/${post_id}`,{
        method:'PATCH',
        body: formData,
        credentials: 'include'
    });
    return response.json();
    
}

export async function deletePost(post_id){
    const response = await fetch(`${BASE_URL}/posts/${post_id}`,{
        method:'DELETE',
        credentials: 'include'
    });
    return response.json();
}   


export async function userLikeStatus(post_id){
    const response = await fetch(`${BASE_URL}/likes/user/status/${post_id}`,{
        method:'GET',
        credentials: 'include'
    });
    return response.json();
}


export async function updatePostLikes(post_id,user_id){
    const response = await fetch(`${BASE_URL}/posts/likes/${post_id}/${user_id}`,{
        method:'PATCH',
        headers:{
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({post_id:post_id}),
        credentials: 'include'
    });
    return response.json();
}

export async function updatePostCommentsCount(post_id){
    const response = await fetch(`${BASE_URL}/posts/comments/counts/${post_id}`,{
        method:'PATCH',
        headers:{
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({post_id:post_id}),
        credentials: 'include'
    });
    return response.json();
}

export async function fetchComments(post_id){
    const response = await fetch(`${BASE_URL}/posts/${post_id}/comments`,{
        method:'GET',
        credentials: 'include'
    });
    return response.json();
}

export async function getComment(comment_id){
    const response = await fetch(`${BASE_URL}/posts/${comment_id}/comment`,{
        method:'GET',
        credentials: 'include'
    });
    return response.json();
}


export async function addComment(post_id,content){
    const response = await fetch(`${BASE_URL}/posts/${post_id}/comment`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({content}),
        credentials: 'include'
    });
    return response.json();
}

export async function updateComment(post_id,comment_id,content){
    const response = await fetch(`${BASE_URL}/posts/${post_id}/comment/${comment_id}`,{
        method:'PATCH',
        headers: {
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({content}),
        credentials: 'include'
    });
    return response.json();
}


export async function deleteComment(post_id, comment_id){
    const response = await fetch(`${BASE_URL}/posts/${post_id}/comment/${comment_id}`,{
        method:'DELETE',
        credentials: 'include'
    }); 
    return response.json();
}


// 사용자 삭제시 게시글/댓글 일괄 삭제
export async function deleteUserComments(user_id){
    const response = await fetch(`${BASE_URL}/user/${user_id}/comments`,{
        method:'DELETE',
        credentials: 'include'
    });
    return response.json();
}

export async function deleteUserPosts(user_id){
    const response = await fetch(`${BASE_URL}/user/${user_id}/posts`,{
        method:'DELETE',
        credentials: 'include'
    });
    return response.json();
}


export async function fetchResource(filePath){
    const response = await fetch(`${filePath.replace(CDN_URL,S3_URL)}`);
    return response;
}