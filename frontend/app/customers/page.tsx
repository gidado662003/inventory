"use client";
import { CustomAlertDialog } from "@/components/CustomAlertDialog";
import { Button } from "@/components/ui/button";

export default function Page() {
  const handleDelete = () => {
    // your delete logic here
    console.log("Item deleted");
  };

  return (
    <div>
      <CustomAlertDialog
        trigger={<Button variant="destructive">Delete Item</Button>}
        title="Are you absolutely sure?"
        description="This action cannot be undone. It will permanently delete this item."
        cancelText="Cancel"
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
