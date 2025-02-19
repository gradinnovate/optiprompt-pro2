import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/context/AuthContext';
import { UserCircle2, LogOut } from 'lucide-react';
import { signInWithGoogle } from '@/lib/services/auth';


const LoginButton: FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleLogin = async () => {
    if (!user) {
      try {
        console.log('Starting authentication...');
        await signInWithGoogle();
        console.log('Authentication completed');
      } catch (error) {
        console.error('Login failed:', error);
      }
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
          onClick={handleLogin}
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
      onClick={handleLogin}
      className="text-blue-200/60 hover:text-blue-200"
    >
      <UserCircle2 className="h-5 w-5 mr-2" />
      <span className="hidden md:inline">{t('login')}</span>
    </Button>
  );
};

export default LoginButton; 