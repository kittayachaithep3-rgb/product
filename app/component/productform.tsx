"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CATEGORIES, ProductSchema } from "../lib/product";
import type { Product } from "../lib/product";

type ProductDraft = z.infer<typeof ProductSchema>;

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
        }
      : { title: "", price: undefined, stock: undefined },
  });

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      noValidate
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))",
        alignItems: "end",
        gap: "1rem",
        maxWidth: "64rem",
        padding: "1.5rem",
        border: "1px solid #e2e8f0",
        borderRadius: "1rem",
        background: "linear-gradient(135deg, #ffffff, #f8fafc)",
        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.09)",
      }}
    >
      <div style={{ display: "grid", gap: "0.4rem" }}>
      <label htmlFor="title" style={{ fontWeight: 600, color: "#334155" }}>ชื่อสินค้า</label>
      <input
        id="title"
        required
        {...register("title")}
        aria-invalid={!!errors.title}
        aria-describedby="title-error"
        style={{ boxSizing: "border-box", width: "100%", padding: "0.7rem 0.8rem", border: `1px solid ${errors.title ? "#ef4444" : "#cbd5e1"}`, borderRadius: "0.5rem", font: "inherit" }}
      />
      <span id="title-error" role="alert" style={{ minHeight: "1.25rem", color: "#dc2626", fontSize: "0.875rem" }}>
        {errors.title?.message}
      </span>
      </div>

      <div style={{ display: "grid", gap: "0.4rem" }}>
      <label htmlFor="price" style={{ fontWeight: 600, color: "#334155" }}>ราคา</label>
      <input
        id="price"
        type="number"
        step="0.01"
        required
        {...register("price", { valueAsNumber: true })}
        aria-invalid={!!errors.price}
        aria-describedby="price-error"
        style={{ boxSizing: "border-box", width: "100%", padding: "0.7rem 0.8rem", border: `1px solid ${errors.price ? "#ef4444" : "#cbd5e1"}`, borderRadius: "0.5rem", font: "inherit" }}
      />
      <span id="price-error" role="alert" style={{ minHeight: "1.25rem", color: "#dc2626", fontSize: "0.875rem" }}>
        {errors.price?.message}
      </span>
      </div>

      <div style={{ display: "grid", gap: "0.4rem" }}>
      <label htmlFor="category" style={{ fontWeight: 600, color: "#334155" }}>หมวดหมู่</label>
      <select
        id="category"
        required
        {...register("category")}
        aria-invalid={!!errors.category}
        aria-describedby="category-error"
        style={{ boxSizing: "border-box", width: "100%", padding: "0.7rem 0.8rem", border: `1px solid ${errors.category ? "#ef4444" : "#cbd5e1"}`, borderRadius: "0.5rem", backgroundColor: "#fff", font: "inherit" }}
      >
        <option value="">กรุณาเลือกหมวดหมู่</option>
        {CATEGORIES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <span id="category-error" role="alert" style={{ minHeight: "1.25rem", color: "#dc2626", fontSize: "0.875rem" }}>
        {errors.category?.message}
      </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", gridColumn: "1 / -1", justifyContent: "flex-end" }}>
        <button
          type="submit"
          disabled={!isDirty || !isValid}
          style={{ minWidth: "10rem", padding: "0.75rem 1.25rem", border: 0, borderRadius: "0.65rem", background: !isDirty || !isValid ? "#94a3b8" : "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "#fff", font: "inherit", fontWeight: 600, cursor: !isDirty || !isValid ? "not-allowed" : "pointer", boxShadow: !isDirty || !isValid ? "none" : "0 4px 12px rgba(37, 99, 235, 0.25)" }}
        >
          {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            style={{ padding: "0.75rem 1rem", border: "1px solid #cbd5e1", borderRadius: "0.5rem", backgroundColor: "#fff", color: "#475569", font: "inherit", cursor: "pointer" }}
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}