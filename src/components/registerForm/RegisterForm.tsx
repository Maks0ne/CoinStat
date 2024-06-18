import { FC, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { FirebaseError } from 'firebase/app';

import './registerForm.scss';

interface IFormInput {
  email: string;
  password: string;
}

interface IRegisterFormProps {
  onClose: () => void;
}
const RegisterForm: FC<IRegisterFormProps> = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormInput>();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
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
    <div className="register-form">
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
        <button className='submit-btn' type="submit">Register</button>
        <button className='button-close' onClick={onClose}>Close</button>
        {error && <p>{error}</p>}

      </form>
      {isSuccessModalOpen &&
        <div className='succsess-registration-modal'>

          <h2>registration successful</h2>
          <p className='close-btn' onClick={closeModal}></p>
        </div>
      }
    </div>
  );
}

export default RegisterForm;
