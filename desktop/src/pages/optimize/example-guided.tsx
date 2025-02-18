import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Background from '@/components/ui/Background';

const ExampleGuidedPage: FC = () => {
  const { t } = useTranslation();

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
              {t('modes.exampleGuided.title')}
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {t('modes.exampleGuided.description')}
            </motion.p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Textarea
                  placeholder={t('modes.exampleGuided.taskDescriptionPlaceholder')}
                  className="h-32 bg-gray-900/40 border-blue-200/10 text-blue-100 placeholder:text-blue-100/50"
                />
                <Textarea
                  placeholder={t('modes.exampleGuided.initialPromptPlaceholder')}
                  className="h-32 bg-gray-900/40 border-blue-200/10 text-blue-100 placeholder:text-blue-100/50"
                />
                <Textarea
                  placeholder={t('modes.exampleGuided.examplePlaceholder')}
                  className="h-32 bg-gray-900/40 border-blue-200/10 text-blue-100 placeholder:text-blue-100/50"
                />
                <Button variant="glow" className="w-full">
                  {t('optimize')}
                </Button>
              </motion.div>

              {/* Results Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Tabs defaultValue="optimized" className="w-full">
                  <TabsList className="w-full bg-gray-900/40 border-blue-200/10">
                    <TabsTrigger value="optimized" className="text-blue-100/70 data-[state=active]:text-blue-100">
                      {t('results.optimized')}
                    </TabsTrigger>
                    <TabsTrigger value="variants" className="text-blue-100/70 data-[state=active]:text-blue-100">
                      {t('results.variants')}
                    </TabsTrigger>
                    <TabsTrigger value="outputs" className="text-blue-100/70 data-[state=active]:text-blue-100">
                      {t('results.outputs')}
                    </TabsTrigger>
                    <TabsTrigger value="scores" className="text-blue-100/70 data-[state=active]:text-blue-100">
                      {t('results.scores')}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="optimized" className="mt-4">
                    <div className="bg-gray-900/40 rounded-lg p-4 border border-blue-200/10 text-blue-100">
                      {/* Optimized prompt content */}
                    </div>
                  </TabsContent>
                  <TabsContent value="variants" className="mt-4">
                    <div className="space-y-4">
                      {/* Variants content */}
                    </div>
                  </TabsContent>
                  <TabsContent value="outputs" className="mt-4">
                    <div className="space-y-4">
                      {/* Outputs content */}
                    </div>
                  </TabsContent>
                  <TabsContent value="scores" className="mt-4">
                    <div className="space-y-4">
                      {/* Scores content */}
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ExampleGuidedPage; 