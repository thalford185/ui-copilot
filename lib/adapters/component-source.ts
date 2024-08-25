import { promises as fs } from "fs";

// For local demonstration only
// Instead identify the user and store the file in remote storage

export async function getComponentSource() {
  return await fs.readFile("var/component.tsx", "utf-8");
}

export async function setComponentSource(source: string) {
  return await fs.writeFile("var/component.tsx", source, "utf-8");
}
