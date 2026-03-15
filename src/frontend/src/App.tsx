import { BuilderPage } from "@/components/BuilderPage";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <>
      <BuilderPage />
      <Toaster richColors position="top-right" />
    </>
  );
}
