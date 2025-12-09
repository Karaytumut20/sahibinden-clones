"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ListingMap = dynamic(() => import("./ListingMapClient"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
});

export default ListingMap;