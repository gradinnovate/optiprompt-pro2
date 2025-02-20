import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  CardDescription
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import { signInWithGoogle } from '@/lib/services/auth';

const Hero: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleGetStarted = async () => {
    if (!user) {
      try {
        console.log('Starting authentication...');
        await signInWithGoogle();
        console.log('Authentication completed');
      } catch (error) {
        console.error('Login failed:', error);
        return;
      }
    }
    navigate('/check-connection');
  };

  const handleLearnMore = async () => {
    try {
      await window.electron.ipcRenderer.invoke('open-external', 'https://optiprompt-pro2.vercel.app');
    } catch (error) {
      console.error('Failed to open external link:', error);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Glowing orb effects */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-20" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-[100px] opacity-20" />
      
      <motion.div 
        className="relative max-w-6xl mx-auto px-4 py-32 sm:px-6 md:px-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="text-center space-y-8">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100"
            variants={item}
          >
            {t('welcome')}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed"
            variants={item}
          >
            {t('description')}
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={item}
          >
            <Button 
              variant="glow" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={handleGetStarted}
            >
              {t('getStarted')}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 text-black-100 border-blue-200/20 hover:bg-blue-900/20 hover:text-white backdrop-blur-sm"
              onClick={handleLearnMore}
            >
              {t('learnMore')}
            </Button>
          </motion.div>

          <Separator className="my-16 bg-blue-200/10" />

          {/* Feature cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
            variants={container}
          >
            {[
              { title: t('feature1.title'), description: t('feature1.description'), icon: '🤖', gradient: 'from-blue-500 to-cyan-500' },
              { title: t('feature2.title'), description: t('feature2.description'), icon: '🚀', gradient: 'from-purple-500 to-pink-500' },
              { title: t('feature3.title'), description: t('feature3.description'), icon: '🔒', gradient: 'from-emerald-500 to-green-500' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-gray-900/40 backdrop-blur-sm rounded-lg p-6 border border-blue-200/10 h-[280px]"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-blue-200 mb-3">
                  {feature.title}
                </h3>
                <CardDescription className="text-blue-100/70 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero; 