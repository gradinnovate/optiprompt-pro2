import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Background from '@/components/ui/Background';

const ModeSelectionPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const modes = [
    {
      id: 'example-guided',
      title: t('modes.exampleGuided.title'),
      description: t('modes.exampleGuided.description'),
      icon: '💡',
      path: '/optimize/example-guided',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'standalone',
      title: t('modes.standalone.title'),
      description: t('modes.standalone.description'),
      icon: '🎭',
      path: '/optimize/standalone',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <>
      <Background />
      <main className="relative z-0">
        <div className="relative max-w-6xl mx-auto px-4 py-32 sm:px-6 md:px-8">
          <div className="text-center space-y-8">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {t('modes.selectTitle')}
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {t('modes.selectDescription')}
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {modes.map((mode, index) => (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Card className="bg-gray-900/40 border-blue-200/10 backdrop-blur-sm hover:bg-gray-900/60 transition-colors duration-300">
                    <CardHeader>
                      <div className="text-4xl mb-3">{mode.icon}</div>
                      <CardTitle className={`text-2xl bg-gradient-to-r ${mode.gradient} bg-clip-text text-transparent`}>
                        {mode.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-blue-100/70 text-base mb-6">
                        {mode.description}
                      </CardDescription>
                      <Button
                        variant="glow"
                        className="w-full"
                        onClick={() => navigate(mode.path)}
                      >
                        {t('modes.select')} {mode.title}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ModeSelectionPage; 