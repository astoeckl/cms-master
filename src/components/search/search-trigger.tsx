/**
 * Search Trigger Component - Opens search dialog
 */

'use client';

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "./search-dialog";

export function SearchTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-9 w-9 px-0 md:w-auto md:px-3"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:ml-2">Search</span>
      </Button>

      <SearchDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}