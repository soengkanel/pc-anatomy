"use client";

// Small client wrapper that lazy-loads the real Whiteboard component with
// SSR disabled. tldraw touches browser globals at import time, so it cannot
// be rendered on the server — and Next 16 only allows ssr:false in Client
// Components.

import dynamic from "next/dynamic";

const Whiteboard = dynamic(() => import("./Whiteboard"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-background text-muted">
      Loading whiteboard…
    </div>
  ),
});

export function WhiteboardClient() {
  return <Whiteboard />;
}
