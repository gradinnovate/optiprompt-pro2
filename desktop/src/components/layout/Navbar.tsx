import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import { useAuth } from '@/lib/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserCircle2 } from 'lucide-react';

const Navbar: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="fixed w-full px-4 py-4 z-50 bg-gray-900/40 backdrop-blur-sm border-b border-blue-200/10">
      <div className="max-w-7xl mx-auto grid grid-cols-12 items-center">
        {/* Logo section */}
        <div className="col-span-3">
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img src="./logo.svg" alt="OptiPrompt Pro" className="w-9 h-9" />
            <span className="text-xl font-semibold text-blue-50">OptiPrompt Pro</span>
          </Link>
        </div>

        {/* Navigation links - center */}
        <div className="col-span-6 hidden md:flex items-center justify-center gap-6">
          <Link to="/">
            <Button 
              variant="ghost" 
              className={location.pathname === '/' ? 'text-blue-200' : 'text-blue-200/60 hover:text-blue-200'}
            >
              {t('nav.home')}
            </Button>
          </Link>
          {user && (
            <>
              
              <Link to="/check-connection">
                <Button 
                  variant="ghost" 
                  className={location.pathname === '/check-connection' ? 'text-blue-200' : 'text-blue-200/60 hover:text-blue-200'}
                >
                  {t('nav.connection')}
                </Button>
              </Link>
              <Link to="/app">
                <Button 
                  variant="ghost" 
                  className={location.pathname === '/app' ? 'text-blue-200' : 'text-blue-200/60 hover:text-blue-200'}
                >
                  {t('nav.optimize')}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Right section - Language & User Profile */}
        <div className="col-span-2 flex items-center justify-end gap-6">
          <LanguageSelector /> 
          {user && (
            <div className="flex items-center gap-2 min-w-[250px]">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback>
                  <UserCircle2 className="h-6 w-6 text-blue-200/60" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:block text-sm text-blue-100 truncate w-[100px] text-right">
                {user.displayName || user.email}
              </span>
            </div>
          )}
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar; 