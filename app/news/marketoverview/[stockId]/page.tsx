import { Suspense } from "react";
import StockDetailClient from "./StockDetailClient";

interface PageProps {
  params: Promise<{ stockId: string }>;
}

export default async function StockDetail({ params }: PageProps) {
  const { stockId } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StockDetailClient stockId={stockId} />
    </Suspense>
  );
}
