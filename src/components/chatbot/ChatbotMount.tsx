"use client";

import { usePathname } from "next/navigation";
import { ChatWidget } from "./ChatWidget";

/**
 * Wrapper: chỉ show chatbot ở public pages, ẩn trong /admin.
 */
export function ChatbotMount() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <ChatWidget />;
}
