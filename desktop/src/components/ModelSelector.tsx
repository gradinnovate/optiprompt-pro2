import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  models: string[];
  className?: string;
  loading?: boolean;
}

const ModelSelector: FC<ModelSelectorProps> = ({ 
  value, 
  onValueChange, 
  models,
  className,
  loading = false
}) => {
  const { t } = useTranslation();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={loading}>
      <SelectTrigger className={`bg-gray-900/40 border-blue-200/10 text-blue-100 ${className}`}>
        <SelectValue placeholder={loading ? t('loading') : t('selectModel')} />
      </SelectTrigger>
      <SelectContent 
        className="bg-gray-900/95 border-blue-200/10"
        position="popper"
        sideOffset={4}
      >
        {models.map((model) => (
          <SelectItem 
            key={model} 
            value={model}
            className="text-blue-100/70 hover:bg-blue-500/20 hover:text-blue-100 focus:bg-blue-500/20 focus:text-blue-100 data-[state=checked]:bg-blue-500/30 data-[state=checked]:text-blue-100"
          >
            {model}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelector; 