"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const router = useRouter();

  return (
    <section className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <div className="mb-8">
          <span className="text-8xl sm:text-9xl font-mono font-bold text-gradient">
            404
          </span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 font-mono">
          <span className="text-primary">//</span> Page Not Found
        </h1>
        
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="hero" size="lg" asChild>
            <Link href="/">
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </Button>
          <Button variant="glass" size="lg" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-card border border-border max-w-md mx-auto">
          <pre className="text-left text-sm font-mono text-muted-foreground overflow-x-auto">
            <code>
{`$ curl -X GET /this-page
> HTTP/1.1 404 Not Found
> Content-Type: text/html
> 
> Error: Resource not found
> Try: /home or /projects`}
            </code>
          </pre>
        </div>
      </motion.div>
    </section>
  );
};

export default NotFound;
