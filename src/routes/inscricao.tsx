import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/inscricao")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
