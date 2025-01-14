export function validateEmail(email) {
    if (!email) {
      return { valid: false, message: "*이메일을 입력해주세요." };
    } else if (!/^[a-zA-Z0-9.!_%+-]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(email)) {
      return { valid: false, message: "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)" };
    } else {
      return { valid: true, message: "" };
    }
  }
  
  export function validatePassword(password) {
    if (!password) {
      return { valid: false, message: "*비밀번호를 입력해주세요." };
    } else if (
      password.length < 8 ||
      password.length > 20 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>=+\_\-~`//]/.test(password)
    ) {
      return { valid: false, message: "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다." };
    } else {
      return { valid: true, message: "" };
    }
  }
  
  export function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) {
      return { valid: false, message: "*비밀번호를 한 번 더 입력해주세요." };
    } else if (password !== confirmPassword) {
      return { valid: false, message: "*비밀번호가 다릅니다." };
    } else {
      return { valid: true, message: "" };
    }
  }
  
  export function validateNickname(nickname) {
    if (!nickname) {
      return { valid: false, message: "*닉네임을 입력해주세요." };
    } else if (nickname.length > 10) {
      return { valid: false, message: "*닉네임은 최대 10자까지 작성 가능합니다." };
    } else if (/\s/.test(nickname)) {
      return { valid: false, message: "*띄어쓰기를 없애주세요." };
    } else {
      return { valid: true, message: "" };
    }
  }
  
  export function validateProfile(profileImage) {
    if (!profileImage) {
      return { valid: false, message: "*프로필 사진을 추가해주세요." };
    } else {
      return { valid: true, message: "" };
    }
  }
  
  export function validatePostTitle(postTitle) {
    if (postTitle.length > 26) {
      return { valid: false, message: "*제목을 26자 이하로 작성해주세요." };
    } else if (!postTitle) {
      return { valid: false, message: "*제목을 입력해주세요." };
    } else {
      return { valid: true, message: "" };
    }
  }
  
  export function validatePostContent(postContent) {
    if (!postContent) {
      return { valid: false, message: "*내용을 입력해주세요." };
    } else {
      return { valid: true, message: "" };
    }
  }
  