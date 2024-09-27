import PageHeader from "@/src/components/PageHeader/PageHeader";
import SupplierTable from "./_components/SupplierTable";
import SupplierModel from "@/src/components/Model/SupplierModel";

const page = async () => {
  
  return (
    <>
      <div className="container mx-auto flex justify-between items-center gap-4 py-8">
        <PageHeader>All Suppliers</PageHeader>
        <SupplierModel/>
      </div>
      <SupplierTable />
    </>
  );
};

export default page;
