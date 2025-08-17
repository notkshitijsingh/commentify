'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/hooks/use-auth-context';
import { Copy, Download, Save } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

interface ActionsToolbarProps {
  commentedCode: string;
  onSave: () => void;
  language: string;
}

export default function ActionsToolbar({ commentedCode, onSave, language }: ActionsToolbarProps) {
  const { toast } = useToast();
  const { user } = useAuthContext();

  const handleCopy = () => {
    if (!commentedCode) return;
    navigator.clipboard.writeText(commentedCode);
    toast({ title: 'Copied to clipboard!' });
  };

  const handleDownload = () => {
    if (!commentedCode) return;
    const fileExtensionMap: { [key: string]: string } = {
        javascript: 'js',
        python: 'py',
        java: 'java',
        csharp: 'cs',
        cpp: 'cpp',
        html: 'html',
        css: 'css',
        typescript: 'ts',
        go: 'go',
        rust: 'rs',
        php: 'php',
        ruby: 'rb'
    }
    const extension = fileExtensionMap[language] || 'txt';
    const blob = new Blob([commentedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commentified_code.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Download started!' });
  };

  return (
    <TooltipProvider>
    <div className="absolute bottom-8 right-8 z-10">
      <div className="flex items-center gap-2 p-2 rounded-lg shadow-2xl bg-background/80 glassmorphism border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!commentedCode}>
              <Copy className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy Code</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!commentedCode}>
              <Download className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download Code</p>
          </TooltipContent>
        </Tooltip>
        
        {user && (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={onSave} disabled={!commentedCode}>
                        <Save className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Save to History</p>
                </TooltipContent>
            </Tooltip>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
}
