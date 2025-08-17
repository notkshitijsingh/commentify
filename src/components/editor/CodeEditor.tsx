'use client';

import Editor, { OnChange, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { Skeleton } from '../ui/skeleton';

interface CodeEditorProps {
  value: string;
  onChange?: OnChange;
  language: string;
  readOnly?: boolean;
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
}

export default function CodeEditorComponent({
  value,
  onChange,
  language,
  readOnly = false,
  editorRef
}: CodeEditorProps) {

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
  };
  
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      onMount={handleEditorDidMount}
      theme={ document.documentElement.classList.contains('dark') ? "vs-dark" : "vs"}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'Source Code Pro', monospace",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on',
        padding: {
          top: 16,
          bottom: 16,
        },
      }}
      loading={<Skeleton className="h-full w-full" />}
    />
  );
}
