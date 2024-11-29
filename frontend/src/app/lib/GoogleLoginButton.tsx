import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { FC } from 'react';

interface GoogleLoginButtonProps { }

const GoogleLoginButton: FC<GoogleLoginButtonProps> = () => {
  // Xử lý khi đăng nhập thành công
  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const { credential } = credentialResponse;
      if (credential) {
        const res = await axios.post(`http://${process.env.NEXT_PUBLIC_HOST}/auth/google`, { tokenId: credential });

        console.log('JWT Token:', res.data.token);
        console.log('User Info:', res.data);
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('user', res.data.user.userid);
        sessionStorage.setItem('name', res.data.user.username);
        sessionStorage.setItem('avatar', res.data.user.userpath);
        window.location.href = `${window.location.pathname}`;
      } else {
        console.error('No credential found in the response');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLoginError = () => {
    console.error('Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId={'763739509902-6qkktjc9l3k5sqk68ph9pr4l6imhrqbl.apps.googleusercontent.com'}>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
