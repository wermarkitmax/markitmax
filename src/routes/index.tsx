import { createFileRoute } from "@tanstack/react-router";
import { MarkitMaxApp } from "@/components/MarkitMaxApp";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <MarkitMaxApp />;
}
