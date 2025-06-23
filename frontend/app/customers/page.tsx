"use client";
import { CustomAlertDialog } from "@/components/CustomAlertDialog";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/TopBar";

export default function Page() {
  const handleDelete = () => {
    // your delete logic here
  };

  return (
    <>
      <TopBar />
      <div className="p-6">
        <CustomAlertDialog
          trigger={<Button variant="destructive">Delete Item</Button>}
          title="Are you absolutely sure?"
          description="This action cannot be undone. It will permanently delete this item."
          cancelText="Cancl"
          confirmText="Delete"
          onConfirm={handleDelete}
        />
      </div>
    </>
  );
}
