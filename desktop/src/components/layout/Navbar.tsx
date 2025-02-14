import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LoginButton from '@/components/auth/LoginButton';
import LanguageSelector from '@/components/LanguageSelector';
import { Separator } from '@/components/ui/separator';

const Navbar: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <nav className="fixed w-full px-4 py-3 z-50 bg-gray-900/40 backdrop-blur-sm border-b border-blue-200/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo section */}
        <Link 
          to="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/logo.svg" alt="OptiPrompt Pro" className="w-8 h-8" />
          <span className="text-xl font-semibold text-blue-50">OptiPrompt Pro</span>
        </Link>

        {/* Navigation links - center */}
        <div className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          <Link to="/">
            <Button 
              variant="ghost" 
              className={location.pathname === '/' ? 'text-blue-200' : 'text-blue-200/60 hover:text-blue-200'}
            >
              {t('nav.home')}
            </Button>
          </Link>
          {location.pathname !== '/' && (
            <Link to="/check-connection">
              <Button 
                variant="ghost" 
                className={location.pathname === '/check-connection' ? 'text-blue-200' : 'text-blue-200/60 hover:text-blue-200'}
              >
                {t('nav.connection')}
              </Button>
            </Link>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <Separator orientation="vertical" className="h-6 bg-blue-200/10" />
          <LoginButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 