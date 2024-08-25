"use client";

import html2canvas from "html2canvas";
import Editor from "./Editor";
import { useRef, useState } from "react";
import CopilotSheet from "./CopilotSheet";

interface AppProps {
  initialEditorContent: string;
}

export default function App({
  initialEditorContent: initialEditorContent,
}: AppProps) {
  const [content, updateContent] = useState<string>(initialEditorContent);
  const viewerIframeRef = useRef<HTMLIFrameElement>(null);

  // For demonstration only. html2canvas does not support all CSS properties
  // https://html2canvas.hertzen.com/features
  const getComponentScreenshotUrl = async () => {
    const iframeBody = viewerIframeRef.current?.contentWindow?.document.body;
    if (iframeBody) {
      const canvas = await html2canvas(iframeBody);
      return canvas.toDataURL("image/png");
    } else {
      return null;
    }
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="max-h-full">
        <Editor content={content} onUpdateContent={updateContent} />
      </div>
      <div className="border-gray-900 border-e-2">
        <iframe
          width="100%"
          height="100%"
          ref={viewerIframeRef}
          src="/viewer"
        />
      </div>
      <CopilotSheet
        getComponentScreenshotUrl={getComponentScreenshotUrl}
        content={content}
        updateContent={updateContent}
      />
    </div>
  );
}
