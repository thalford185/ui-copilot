"use client";
import { Editor as MonacoEditor } from "@monaco-editor/react";

interface EditorProps {
  content: string;
  onUpdateContent: (content: string) => void;
}

export default function Editor({ content, onUpdateContent }: EditorProps) {
  return (
    <MonacoEditor
      theme="vs-dark"
      language="typescript"
      beforeMount={(monaco) => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          jsx: monaco.languages.typescript.JsxEmit.React,
        });
      }}
      onMount={(editor, monaco) => {
        editor.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
          async () => {
            await fetch("/api/editor", {
              method: "PUT",
              body: editor.getValue(),
            });
          }
        );
      }}
      options={{
        minimap: { enabled: false },
      }}
      onChange={(value) => {
        value && onUpdateContent(value);
      }}
      value={content}
    />
  );
}
