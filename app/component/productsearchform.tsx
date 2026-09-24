"use client";

import { useForm } from "react-hook-form";
import { SORT_FIELDS, defaultQuery } from "../lib/product";
import type { SearchQuery } from "../lib/product";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm(
  { onSearch }: ProductSearchFormProps
) {
  const { register } = useForm<SearchQuery>({
    defaultValues: defaultQuery,
  });

  return (
    <form>
      <label htmlFor="q">คำค้น</label>
      <input id="q" {...register("q")} placeholder="phone" />

      <label htmlFor="limit">จำนวนรายการ</label>
      <input id="limit" type="number" required
        
        {...register("limit", { valueAsNumber: true })} />

      <label htmlFor="sortBy">เรียงตาม</label>
      <select id="sortBy" {...register("sortBy")}>
        {SORT_FIELDS.map((field) => (
          <option key={field} value={field}>{field}</option>
        ))}
      </select>

      <button type="submit">ค้นหา</button>
    </form>
  );
}