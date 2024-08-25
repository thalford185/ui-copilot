"server only";

import App from "@/components/App";
import { getComponentSource } from "@/lib/adapters/component-source";

export default async function Home() {
  const initialContent = await getComponentSource();
  return <App initialEditorContent={initialContent} />;
}
