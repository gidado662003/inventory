"use client";

import React, { useState } from "react";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import { useSales } from "@/hooks/useSales";
import { SalesSummary } from "./SalesSummary";
import { AddItemsForm } from "./AddItemsForm";
import { CartItems } from "./CartItems";
import { PaymentSection } from "./PaymentSection";

const SalesSpreadsheet = () => {
  const {
    itemOptions,
    data,
    setData,
    cart,
    customers,
    salesSummary,
    addToCart,
    removeFromCart,
    updateCartPaymentType,
    createNewSale,
    calculateTotals,
  } = useSales();

  const [terminal, setTerminal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Sales Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your sales and inventory
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <SalesSummary
              summary={salesSummary}
              onCalculate={calculateTotals}
              trigger={
                <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg shadow-xs hover:shadow-sm text-sm font-medium text-foreground hover:bg-muted transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Generate Report
                </button>
              }
            />
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-primary rounded-lg shadow-xs hover:shadow-sm text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all"
              onClick={() => setTerminal(!terminal)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {terminal ? "Close Terminal" : "POS Mode"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
          {/* Spreadsheet Section */}
          <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-medium text-card-foreground">
                Sales Spreadsheet
              </h2>
            </div>
            <div className="p-2 overflow-auto">
              <Spreadsheet
                data={data}
                onChange={setData}
                className="w-full min-w-[600px]"
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Add Items Card */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-medium text-card-foreground">
                  Add Products
                </h2>
              </div>
              <div className="p-4">
                <AddItemsForm
                  itemOptions={itemOptions}
                  onAddToCart={addToCart}
                />
              </div>
            </div>

            {/* Cart Items Card */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-medium text-card-foreground">
                  Cart Items
                  {cart.length > 0 && (
                    <span className="ml-2 bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {cart.length} items
                    </span>
                  )}
                </h2>
              </div>
              <div className="p-4">
                <CartItems cart={cart} onRemoveItem={removeFromCart} />
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-medium text-card-foreground">Payment</h2>
              </div>
              <div className="p-4">
                <PaymentSection
                  cart={cart}
                  customers={customers}
                  onUpdatePaymentType={updateCartPaymentType}
                  onSaveSale={createNewSale}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesSpreadsheet;
