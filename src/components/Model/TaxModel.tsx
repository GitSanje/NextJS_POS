"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tax } from "@prisma/client"
import { Plus } from 'lucide-react'
import TaxForm from "../Product/TaxForm";


interface TaxModalProps {
  edit?: boolean;
  tax?: Tax;
  setTax: (tax: Tax) => void;
}

export function TaxModal({ edit = false, tax, setTax }: TaxModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = (updatedTax: Tax) => {
    setTax(updatedTax);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        {edit ? (
          <Button variant="ghost" className="h-8 w-8 p-0">
            Edit
          </Button>
        ) : (
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Tax
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(true)}>
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Tax" : "Add Tax"}</DialogTitle>
        </DialogHeader>
        <TaxForm
          tax={tax}
          setTax={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
