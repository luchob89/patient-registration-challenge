"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

interface TransitionContextValue {
  navigate: (href: string) => void;
  goBack: () => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
  goBack: () => {},
});

export function useNavigate() {
  return useContext(TransitionContext).navigate;
}

export function useGoBack() {
  return useContext(TransitionContext).goBack;
}

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // The content actually rendered — frozen during exit so old page stays visible
  const [displayChildren, setDisplayChildren] = useState(children);
  const [opacity, setOpacity] = useState(1);

  const pendingHref = useRef<string | null>(null);
  const phase = useRef<"idle" | "exiting" | "navigating">("idle");
  const prevPathname = useRef(pathname);

  // Keep displayed content in sync while we're not mid-transition
  useEffect(() => {
    if (phase.current === "idle") {
      setDisplayChildren(children);
    }
  }, [children]);

  // When Next.js completes navigation, swap content and fade back in
  useEffect(() => {
    if (phase.current === "navigating" && pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      pendingHref.current = null;
      phase.current = "idle";
      // Batched: new content appears at opacity 0, then animates to 1
      setDisplayChildren(children);
      setOpacity(1);
    }
  }, [pathname, children]);

  const navigate = useCallback((href: string) => {
    if (phase.current !== "idle") return;
    pendingHref.current = href;
    phase.current = "exiting";
    setOpacity(0);
  }, []);

  const goBack = useCallback(() => {
    if (phase.current !== "idle") return;
    pendingHref.current = "__back__";
    phase.current = "exiting";
    setOpacity(0);
  }, []);

  // After fade-out finishes, actually navigate
  const handleAnimationComplete = useCallback(() => {
    if (phase.current === "exiting" && pendingHref.current) {
      phase.current = "navigating";
      if (pendingHref.current === "__back__") {
        router.back();
      } else {
        router.push(pendingHref.current);
      }
    }
  }, [router]);

  return (
    <TransitionContext.Provider value={{ navigate, goBack }}>
      <motion.div
        animate={{ opacity }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onAnimationComplete={handleAnimationComplete}
        className="flex flex-col flex-1"
      >
        {displayChildren}
      </motion.div>
    </TransitionContext.Provider>
  );
}
