import { FC, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { FirebaseError } from 'firebase/app';

import './loginForm.scss';

interface IFormInput {
  email: string;
  password: string;
}
interface ILoginFormProps {
  onClose: () => void;
}
const LoginForm: FC<ILoginFormProps> = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormInput>();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('authToken', token);

      setIsSuccessModalOpen(true);
      reset();
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const closeModal = () => {
    setIsSuccessModalOpen(false);
    setError(null);
  };

  return (
    <div className="login-form">
      <form className={isSuccessModalOpen ? 'modal-overlay' : ''} onSubmit={handleSubmit(onSubmit)}>
        <label>Name:</label>
        <input
          type="Email"
          placeholder='Enter Email'
          {...register('email', { required: true })}
        />
        {errors.email && <p>Email is required</p>}
        <label>Password:</label>
        <input
          type="Password"
          placeholder='Enter Password'
          {...register('password', { required: true })}
        />
        {errors.password && <p>Password is required</p>}
        <button className='login-btn' type="submit">Login</button>
        <button className='button-close' onClick={onClose}>Close</button>
        {error && <p>{error}</p>}
      </form>

      {isSuccessModalOpen &&
        <div className='succsess-login-modal'>
          <h2>Login Successful</h2>
          <p>Welcome back! You have successfully logged in.</p>
          <p className='close-btn' onClick={closeModal}></p>
        </div>
      }
    </div>
  );
}

export default LoginForm;
