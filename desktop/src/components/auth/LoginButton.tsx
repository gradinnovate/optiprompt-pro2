import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/context/AuthContext';
import { signInWithGoogle, signOut } from '@/lib/firebase/auth';
import { UserCircle2, LogOut } from 'lucide-react';

const LoginButton: FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleAuth = async () => {
    if (user) {
      await signOut();
    } else {
      await signInWithGoogle();
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:block text-sm text-blue-100">
          {user.displayName}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleAuth}
          className="text-blue-200/60 hover:text-blue-200"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleAuth}
      className="text-blue-200/60 hover:text-blue-200"
    >
      <UserCircle2 className="h-5 w-5 mr-2" />
      <span className="hidden md:inline">{t('signInWithGoogle')}</span>
    </Button>
  );
};

export default LoginButton; 