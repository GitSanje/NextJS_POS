"use client";
import Modal from "@/components/ui/model";
import { Pencil1Icon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import ProductForm from "../form/ProductForm";
import { Button } from "@/components/ui/button";

const ProductModel = () => {
  let [openModel, setOpenModel] = useState(false);
  return (
    <div className="flex justify-between rounded-lg bg-white px-4 py-4 text-gray-900 shadow">
      <Modal open={openModel} onOpenChange={setOpenModel}>
        <Modal.Button>
          <Button>Add Product</Button>
        </Modal.Button>

        <Modal.Content title="Add Product">
          <ProductForm />
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default ProductModel;
