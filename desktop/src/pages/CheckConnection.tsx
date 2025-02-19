import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OllamaService } from '@/lib/services/ollama';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhTW, ja } from 'date-fns/locale';

const CheckConnection: FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [baseUrl, setBaseUrl] = useState(OllamaService.getBaseUrl());
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unchecked' | 'success' | 'failed'>('unchecked');
  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    checkConnectionAndLoadModels();
  }, []);

  const checkConnectionAndLoadModels = async () => {
    setIsChecking(true);
    const isConnected = await OllamaService.checkConnection(baseUrl);
    setConnectionStatus(isConnected ? 'success' : 'failed');

    if (isConnected) {
      OllamaService.setBaseUrl(baseUrl);
      const modelList = await OllamaService.listModels(baseUrl);
      setModels(modelList);
    }
    setIsChecking(false);
  };

  const handleUpdateBaseUrl = () => {
    checkConnectionAndLoadModels();
  };

  const handleProceed = () => {
    navigate('/app');
  };

  const getDateLocale = () => {
    const lang = i18n.language;
    switch (lang) {
      case 'zh': return zhTW;
      case 'ja': return ja;
      default: return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto bg-gray-900/40 border-blue-200/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-50">
              {t('checkConnection.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Base URL Input */}
            <div className="space-y-2">
              <label className="text-sm text-blue-100/70">
                {t('checkConnection.baseUrlLabel')}
              </label>
              <div className="flex gap-2">
                <Input
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="bg-gray-800/50 border-blue-200/20 text-blue-50"
                />
                <Button
                  onClick={handleUpdateBaseUrl}
                  disabled={isChecking}
                  variant="outline"
                  className="min-w-[120px] border-blue-200/20"
                >
                  {isChecking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : connectionStatus === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : connectionStatus === 'failed' ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    t('checkConnection.check')
                  )}
                </Button>
              </div>
            </div>

            {/* Models List */}
            {models.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg text-blue-50">
                  {t('checkConnection.availableModels')}
                </h3>
                <div className="grid gap-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                  {models.map((model) => (
                    <Card 
                      key={model.digest}
                      className="bg-gray-800/30 border-blue-200/10 hover:bg-gray-800/40 transition-colors"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-blue-50 flex items-center justify-between">
                          <span>{model.name}</span>
                          <span className="text-sm font-normal text-blue-200/70">
                            {OllamaService.formatSize(model.size)} {t('checkConnection.modelInfo.gb')}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div className="space-y-1">
                          <div className="text-blue-200/60">{t('checkConnection.modelInfo.family')}</div>
                          <div className="text-blue-50">{model.details.family}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-blue-200/60">{t('checkConnection.modelInfo.parameters')}</div>
                          <div className="text-blue-50">{model.details.parameter_size}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-blue-200/60">{t('checkConnection.modelInfo.quantization')}</div>
                          <div className="text-blue-50">{model.details.quantization_level}</div>
                        </div>
                        <div className="col-span-full text-xs text-blue-200/50 mt-2">
                          {t('checkConnection.modelInfo.modified')}: {
                            formatDistanceToNow(new Date(model.modified_at), {
                              addSuffix: true,
                              locale: getDateLocale()
                            })
                          }
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Proceed Button */}
            <Button
              onClick={handleProceed}
              disabled={connectionStatus !== 'success'}
              className="w-full"
              variant="glow"
            >
              {t('checkConnection.proceed')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckConnection; 