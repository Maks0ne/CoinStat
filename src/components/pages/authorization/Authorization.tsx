import { FC, useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";
import RegistrationForm from "../../registrationForm/RegistrationForm";
import LoginForm from "../../loginForm/LoginForm";

import './authorization.scss'

const Authorization: FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true)
        setCurrentUserEmail(user.email);
      } else {
        setIsAuth(false)
        setCurrentUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('You have successfully logged out of your account');
    } catch (error) {
      setError('An error occurred while logging out of your account');
    }
  };

  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true)
  }
  const handleRegistrationModalOpen = () => {
    setIsRegistrationModalOpen(true)
  }
  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleRegistrationModalClose = () => {
    setIsRegistrationModalOpen(false);
  };

  return (
    <div className="authorization-container">
      {isAuth ? (
        <div className="auth-control">
          <p>You are logged in using email: {currentUserEmail}</p>
          <button onClick={handleLogout}>LogOut</button>
          {error && <p>{error}</p>}
        </div>
      ) : (
        <div className="auth-control">
          <button onClick={handleLoginModalOpen}>Login</button>
          <button onClick={handleRegistrationModalOpen}>Registration</button>
        </div>
      )}
      {isLoginModalOpen && <LoginForm onClose={handleLoginModalClose} />}
      {isRegistrationModalOpen && <RegistrationForm onClose={handleRegistrationModalClose} />}
    </div>
  );
}

export default Authorization