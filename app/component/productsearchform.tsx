"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "../lib/product";
import type { SearchQuery } from "../lib/product";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      noValidate
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        gap: "1rem",
        padding: "1.25rem",
        border: "1px solid #e2e8f0",
        borderRadius: "1rem",
        background: "#fff",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
      }}
    >
      <div style={{ display: "grid", gap: "0.4rem", flex: "1 1 12rem" }}>
        <label htmlFor="q" style={{ fontWeight: 600, color: "#334155" }}>คำค้น</label>
        <input
          id="q"
          {...register("q")}
          placeholder="เช่น phone"
          style={{ width: "100%", boxSizing: "border-box", padding: "0.7rem 0.85rem", border: "1px solid #cbd5e1", borderRadius: "0.6rem", font: "inherit" }}
        />
      </div>

      <div style={{ display: "grid", gap: "0.4rem", flex: "0 1 9rem" }}>
        <label htmlFor="limit" style={{ fontWeight: 600, color: "#334155" }}>จำนวนรายการ</label>
        <input
          id="limit"
          type="number"
          required
          {...register("limit", { valueAsNumber: true })}
          aria-invalid={!!errors.limit}
          aria-describedby="limit-error"
          style={{ width: "100%", boxSizing: "border-box", padding: "0.7rem 0.85rem", border: `1px solid ${errors.limit ? "#dc2626" : "#cbd5e1"}`, borderRadius: "0.6rem", font: "inherit" }}
        />
        <span id="limit-error" role="alert" style={{ minHeight: "1.2em", color: "#dc2626", fontSize: "0.85rem" }}>
          {errors.limit?.message}
        </span>
      </div>

      <div style={{ display: "grid", gap: "0.4rem", flex: "0 1 11rem" }}>
        <label htmlFor="sortBy" style={{ fontWeight: 600, color: "#334155" }}>เรียงตาม</label>
        <select
          id="sortBy"
          {...register("sortBy")}
          style={{ width: "100%", boxSizing: "border-box", padding: "0.7rem 0.85rem", border: "1px solid #cbd5e1", borderRadius: "0.6rem", background: "#fff", font: "inherit" }}
        >
          {SORT_FIELDS.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{ padding: "0.75rem 1.4rem", border: 0, borderRadius: "0.6rem", background: isSubmitting ? "#94a3b8" : "#2563eb", color: "#fff", font: "inherit", fontWeight: 700, cursor: isSubmitting ? "wait" : "pointer", transition: "background 150ms ease" }}
      >
        {isSubmitting ? "กำลังค้นหา" : "ค้นหา"}
      </button>
    </form>
  );
}