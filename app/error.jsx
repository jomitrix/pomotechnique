"use client";

import { useEffect } from "react";
import { Button } from "@heroui/react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-4">
      <h2 className="text-xl font-semibold text-danger">Something went wrong!</h2>
      <p className="text-sm text-neutral-400 max-w-sm">
        An unexpected error occurred while running the application.
      </p>
      <Button
        color="danger"
        variant="flat"
        onPress={() => reset()}
      >
        Try again
      </Button>
    </div>
  );
}