import { DiffEditor as MonacoDiffEditor } from "@monaco-editor/react";

interface DiffEditorProps {
  originalContent: string;
  newContent: string;
}

export default function DiffEditor({
  originalContent,
  newContent,
}: DiffEditorProps) {
  return (
    <MonacoDiffEditor
      theme="vs-dark"
      language="typescript"
      original={originalContent}
      modified={newContent}
      beforeMount={(monaco) => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          jsx: monaco.languages.typescript.JsxEmit.React,
        });
      }}
    />
  );
}
