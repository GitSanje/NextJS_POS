"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteSupplier } from "@/server-actions/supplier/supplier";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import SupplierModel from "../Model/SupplierModel";
import { Supplier } from "@prisma/client";
import { MoreVertical } from "lucide-react";

interface deleteProps {
  id: string;
  disabled?: boolean;
  deleteFun: (id: string) => Promise<any>;
}

export const DeleteDropdownItem: React.FC<deleteProps> = (props) => {
  const { id, disabled, deleteFun } = props;

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const removeItem = async (
    id: string,
    deleteFun: (id: string) => Promise<any>
  ) => {
    await deleteFun(id)
      .then((data) => {
        if (!data) return null;
        if (!data.success) {
          return toast.error(data.error.message);
        }
        toast.success("supplier deleted sucsesfully", {
          autoClose: 2000,
        });

        // redirect("/admin/products");
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong.", {
          autoClose: 2000,
        });
      });
  };

  const handleRemoveItem = async (id: string) => {
    confirmAlert({
      title: "Confirm",
      message: "Are you sure you want to remove this supplier ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => removeItem(id, deleteFun),
        },
        {
          label: "No",
          onClick: () => {}, // Do nothing if user cancels
        },
      ],
    });
  };

  return (
    <DropdownMenuItem
      
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await handleRemoveItem(id);
          router.refresh();
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
};

export const EditDropdownItem = ({
  supplier,
}: {
  supplier: Supplier;
  // setDropdownOpen : (open:null | string) => void
}) => {
  return (
    <DropdownMenuItem asChild>
      {/* SupplierModel for editing */}

      <SupplierModel edit={true} supplier={supplier} />
    </DropdownMenuItem>
  );
};

export const DropDownTable = ({ supplier }: { supplier: Supplier }) => {
  const [openDropdown, setDropdownOpen] = useState<string | null>(null);
  const closeDropdownWithDelay = (delay: number) => {
    setTimeout(() => {
      setDropdownOpen(null);
    }, delay);
  };

  return (
    <DropdownMenu
      open={openDropdown === supplier.id}
      onOpenChange={(open) => setDropdownOpen(open ? supplier.id : null)}
    >
      <DropdownMenuTrigger>
        <MoreVertical />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        
          <DeleteDropdownItem id={supplier.id}
          deleteFun={deleteSupplier} />
        

          <EditDropdownItem supplier={supplier} />
        {/* </span> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
