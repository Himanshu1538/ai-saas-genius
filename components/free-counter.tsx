"use client";

import React, { useEffect, useState } from "react";
import { Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import { MAX_FREE_COUNT } from "@/constants";
import { useProModal } from "@/hooks/use-pro-modal";

// Component to display the free usage counter and prompt to upgrade if the user is not Pro
const FreeCounter = ({
  apiLimitCount = 0,
  isPro = false,
}: {
  apiLimitCount: number;
  isPro: boolean;
}) => {
  const proModal = useProModal();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is only rendered on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Do not render anything if the component is not mounted
  if (!mounted) return null;
  // Do not render anything if the user is Pro
  if (isPro) return null;

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {apiLimitCount} / {MAX_FREE_COUNT} Free Generations
            </p>
            <Progress
              className="h-3"
              value={(apiLimitCount / MAX_FREE_COUNT) * 100}
            />
          </div>
          <Button
            onClick={proModal.onOpen}
            variant="premium"
            className="w-full"
          >
            Upgrade <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeCounter;
