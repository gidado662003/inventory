"use client";

import { useState } from "react";
import { CustomerFormData } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomToast } from "@/components/CustomToast";

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CustomerFormData>;
  isLoading?: boolean;
}

export function CustomerForm({
  onSubmit,
  onCancel,
  initialData = {},
  isLoading = false,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    customerName: initialData.customerName || "",
    phone: initialData.phone || "",
  });
  const [errors, setErrors] = useState<Partial<CustomerFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerFormData> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = "Customer name must be at least 2 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 11-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      CustomToast({
        message: "Validation Error",
        description: "Please fix the errors in the form",
        type: "error",
      });
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ customerName: "", phone: "" });

      setErrors({});
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="customerName"
          className="text-sm font-medium text-foreground"
        >
          Customer Name*
        </Label>
        <Input
          type="text"
          id="customerName"
          value={formData.customerName}
          onChange={(e) => handleInputChange("customerName", e.target.value)}
          className={errors.customerName ? "border-destructive" : ""}
          placeholder="Enter customer name"
          disabled={isLoading}
        />
        {errors.customerName && (
          <p className="text-sm text-destructive">{errors.customerName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-foreground">
          Phone Number*
        </Label>
        <Input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className={errors.phone ? "border-destructive" : ""}
          placeholder="08012345678"
          disabled={isLoading}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          {isLoading ? "Creating..." : "Create Customer"}
        </Button>
      </div>
    </form>
  );
}
