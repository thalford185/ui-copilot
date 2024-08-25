import { setComponentSource } from "@/lib/adapters/component-source";

export async function PUT(request: Request) {
  const newContent = await request.text();
  await setComponentSource(newContent);
  return new Response(null, { status: 204 });
}
