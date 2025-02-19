import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import Background from '@/components/ui/Background';
import ModelSelector from '@/components/ModelSelector';
import { ollamaChat } from '@/lib/services/ollamachat';
import { promptApi } from '@/lib/services/api';
import { Loader2 } from 'lucide-react';
import { OllamaService } from '@/lib/services/ollama';
import ReactMarkdown from 'react-markdown';
import { isMarkdown } from '@/lib/utils/markdown';

interface OptimizationResults {
  initialOutput: string;
  optimizedPrompt: string;
  critiqueFeedback: string;
  refinedPrompts: string[];
  variantOutputs: string[];
}

const ResultContent: FC<{ content: string }> = ({ content }) => {
  if (isMarkdown(content)) {
    return (
      <ReactMarkdown 
        className="prose prose-invert max-w-none prose-pre:bg-gray-800/50 prose-pre:border prose-pre:border-blue-200/10 text-left [&>*]:text-left"
      >
        {content}
      </ReactMarkdown>
    );
  }
  return <p className="text-base whitespace-pre-wrap text-left">{content}</p>;
};

const removeThinkingProcess = (text: string): string => {
  // Return original text if no thinking process tags found
  if (!text.includes('<think>') || !text.includes('</think>')) {
    return text;
  }

  // Use regex to match content between <think> and </think> tags, including the tags
  const thinkingProcessRegex = /<think>[\s\S]*?<\/think>/g;
  
  // Remove all instances of thinking process sections
  return text.replace(thinkingProcessRegex, '').trim();
};


const ExampleGuidedPage: FC = () => {
  const { t } = useTranslation();
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState('');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [example, setExample] = useState('');
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<string[]>([]);
  const [results, setResults] = useState<Partial<OptimizationResults>>({});
  const [optimizing, setOptimizing] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [rawResults, setRawResults] = useState<Partial<OptimizationResults>>({});

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const baseUrl = OllamaService.getBaseUrl();
        const modelList = await OllamaService.listModels(baseUrl);
        setModels(modelList.map(model => model.name));
        if (modelList.length > 0) {
          setSelectedModel(modelList[0].name);
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    if (!rawResults.initialOutput) return;

    setResults({
      ...results,
      initialOutput: showThinking ? rawResults.initialOutput : removeThinkingProcess(rawResults.initialOutput),
      variantOutputs: rawResults.variantOutputs?.map(output => 
        showThinking ? output : removeThinkingProcess(output)
      )
    });
  }, [showThinking, rawResults]);

  const handleOptimize = async () => {
    if (!selectedModel || !taskDescription || !initialPrompt || !example) {
      return;
    }

    setOptimizing(true);
    // Clear previous results
    setResults({});
    setRawResults({});
    ollamaChat.updateBaseUrl(OllamaService.getBaseUrl());

    try {
      // Step 3: Test initial prompt
      let initialOutput = await ollamaChat.chat(selectedModel, [
        { role: 'user', content: `${initialPrompt}\n${example}` }
      ]);
      setRawResults(prev => ({ ...prev, initialOutput }));
      const untaggedInitialOutput = removeThinkingProcess(initialOutput);

      // Step 4: Generate optimized prompt
      const { optimizedPrompt } = await promptApi.generatePrompt(
        taskDescription,
        initialPrompt
      );
      setResults(prev => ({ ...prev, optimizedPrompt }));

      const fullExample = `$[Example]\n{example}\n\n[LLM Response]\n${untaggedInitialOutput}`;
      // Step 5: Get critique feedback
      const { critiqueFeedback } = await promptApi.getCritique(
        optimizedPrompt,
        fullExample
      );
      setResults(prev => ({ ...prev, critiqueFeedback }));

      // Step 6: Get refined prompts
      const { refinedPrompts } = await promptApi.refinePrompt(
        optimizedPrompt,
        critiqueFeedback
      );
      setResults(prev => ({ ...prev, refinedPrompts }));

      // Step 7: Test refined prompts
      const variantOutputs: string[] = [];
      for (const prompt of refinedPrompts) {
        const output = await ollamaChat.chat(selectedModel, [
          { role: 'user', content: `${prompt}\n${example}` }
        ]);
        
        variantOutputs.push(output);
        
        setRawResults(prev => ({
          ...prev,
          variantOutputs: [...variantOutputs]
        }));
      }
   
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <>
      <Background />
      <main className="relative z-0">
        <div className="relative mx-auto px-2 py-32 sm:px-4">
          <div className="text-center space-y-8">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {t('modes.exampleGuided.title')}
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {t('modes.exampleGuided.description')}
            </motion.p>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 max-w-[1800px] mx-auto">
              {/* Input Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 w-full col-span-2"
              >
                <div className="space-y-2">
                  <label className="text-base font-medium text-blue-100/70">
                    {t('modelSelector.label')}
                  </label>
                  <p className="text-sm text-blue-100/50">
                    {t('modelSelector.description')}
                  </p>
                  <ModelSelector
                    value={selectedModel}
                    onValueChange={setSelectedModel}
                    models={models}
                    className="w-full"
                    loading={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-base font-medium text-blue-100/70">
                    {t('taskDescription.label')}
                  </label>
                  <p className="text-sm text-blue-100/50">
                    {t('taskDescription.description')}
                  </p>
                  <Textarea
                    placeholder={t('modes.exampleGuided.taskDescriptionPlaceholder')}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="h-32 bg-gray-900/40 border-blue-200/10 text-blue-100 placeholder:text-blue-100/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-base font-medium text-blue-100/70">
                    {t('initialPrompt.label')}
                  </label>
                  <p className="text-sm text-blue-100/50">
                    {t('initialPrompt.description')}
                  </p>
                  <Textarea
                    placeholder={t('modes.exampleGuided.initialPromptPlaceholder')}
                    value={initialPrompt}
                    onChange={(e) => setInitialPrompt(e.target.value)}
                    className="h-32 bg-gray-900/40 border-blue-200/10 text-blue-100 placeholder:text-blue-100/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-base font-medium text-blue-100/70">
                    {t('example.label')}
                  </label>
                  <p className="text-sm text-blue-100/50">
                    {t('example.description')}
                  </p>
                  <Textarea
                    placeholder={t('modes.exampleGuided.examplePlaceholder')}
                    value={example}
                    onChange={(e) => setExample(e.target.value)}
                    className="h-32 bg-gray-900/40 border-blue-200/10 text-blue-100 placeholder:text-blue-100/50"
                  />
                </div>
                <Button 
                  variant="glow" 
                  className="w-full"
                  onClick={handleOptimize}
                  disabled={loading || optimizing || !selectedModel || !taskDescription || !initialPrompt || !example}
                >
                  {optimizing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {t('optimize')}
                </Button>
              </motion.div>

              {/* Results Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full col-span-3"
              >
                <Tabs defaultValue="initial-result" className="w-full">
                  <div className="w-full bg-gray-900/40 border-blue-200/10 flex items-center justify-between px-4">
                    <TabsList className="grid grid-cols-4 gap-0 min-h-[60px] bg-gray-900/40 border-blue-200/10">
                      <TabsTrigger 
                        className="text-blue-100/70 data-[state=active]:text-blue-100 data-[state=active]:bg-blue-900/40 text-sm sm:text-base whitespace-normal h-full py-2 px-2 flex items-center justify-center"
                        value="initial-result"
                      >
                        {t('results.initialResult')}
                      </TabsTrigger>
                      <TabsTrigger 
                        className="text-blue-100/70 data-[state=active]:text-blue-100 data-[state=active]:bg-blue-900/40 text-sm sm:text-base whitespace-normal h-full py-2 px-2 flex items-center justify-center"
                        value="analysis"
                      >
                        {t('results.analysis')}
                      </TabsTrigger>
                      <TabsTrigger 
                        className="text-blue-100/70 data-[state=active]:text-blue-100 data-[state=active]:bg-blue-900/40 text-sm sm:text-base whitespace-normal h-full py-2 px-2 flex items-center justify-center"
                        value="variants"
                      >
                        {t('results.variants')}
                      </TabsTrigger>
                      <TabsTrigger 
                        className="text-blue-100/70 data-[state=active]:text-blue-100 data-[state=active]:bg-blue-900/40 text-sm sm:text-base whitespace-normal h-full py-2 px-2 flex items-center justify-center"
                        value="variant-results"
                      >
                        {t('results.variantResults')}
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-blue-100/70">
                        {t('showThinkingProcess')}
                      </span>
                      <Switch
                        checked={showThinking}
                        onCheckedChange={setShowThinking}
                        className="data-[state=checked]:bg-yellow-600"
                      />
                    </div>
                  </div>
                  <TabsContent value="initial-result" className="mt-4">
                    <div className="space-y-4">
                      <div className="bg-gray-900/40 rounded-lg p-4 border border-blue-200/10 text-blue-100">
                        <h3 className="text-xl font-semibold mb-3">{t('initialPromptTitle')}</h3>
                        <p className="text-base text-left">{initialPrompt || t('noPrompt')}</p>
                      </div>
                      <div className="bg-gray-900/40 rounded-lg p-4 border border-blue-200/10 text-blue-100">
                        <h3 className="text-lg font-semibold mb-2">{t('initialResult')}</h3>
                        <ResultContent content={results?.initialOutput || t('noResults')} />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="analysis" className="mt-4">
                    <div className="space-y-4">
                      <div className="bg-gray-900/40 rounded-lg p-4 border border-blue-200/10 text-blue-100">
                        <h3 className="text-lg font-semibold mb-2">{t('optimizedPrompt')}</h3>
                        <p className="text-base text-left">{results?.optimizedPrompt || t('noPrompt')}</p>
                      </div>
                      <div className="bg-gray-900/40 rounded-lg p-4 border border-blue-200/10 text-blue-100">
                        <h3 className="text-lg font-semibold mb-2">{t('critiqueFeedback')}</h3>
                        <ResultContent content={results?.critiqueFeedback || t('noResults')} />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="variants" className="mt-4">
                    <div className="space-y-4">
                      {(results?.refinedPrompts || []).map((prompt, index) => (
                        <div key={index} className="bg-gray-900/40 rounded-lg p-4 border border-blue-200/10 text-blue-100">
                          <h3 className="text-lg font-medium text-blue-200/80 mb-2">{t('variant')} {index + 1}</h3>
                          <p className="text-base text-left">{prompt}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="variant-results" className="mt-4">
                    <div className="space-y-4">
                      {(results?.variantOutputs || []).map((output, index) => (
                        <div key={index} className="bg-gray-900/40 rounded-lg p-4 border border-blue-200/10 text-blue-100">
                          <h3 className="text-lg font-medium text-blue-200/80 mb-2">{t('variantResult')} {index + 1}</h3>
                          <ResultContent content={output} />
                        </div>
                      ))}
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