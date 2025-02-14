import { FC } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useTranslation } from 'react-i18next';

const LoginButton: FC = () => {
  const { user, signInWithGoogle, signOut } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="absolute top-4 left-4">
      {user ? (
        <div className="flex items-center gap-4">
          <img
            src={user.photoURL || ''}
            alt={user.displayName || 'User'}
            className="w-8 h-8 rounded-full"
          />
          <button
            onClick={signOut}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            {t('signOut')}
          </button>
        </div>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded shadow hover:shadow-md transition-shadow"
        >
          <img
            src="/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          {t('signInWithGoogle')}
        </button>
      )}
    </div>
  );
};

export default LoginButton; 