"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "../lib/product";
import type { Product, ProductList, SearchQuery } from "../lib/product";
import ProductSearchForm from "./productsearchform"; 
import ProductForm from "./productform";

type ProductDraft = Omit<Product, "id">;

type LoadState = "idle" | "loading" | "error" | "ready";

export default function ProductExplorer() {
    const [products, setProducts] = useState<Product[]>([]);
    const [status, setStatus] = useState<LoadState>("idle");
    const [errorMessage, setErrorMessage] = useState("");
    
    
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    function showResult(list: ProductList) {
        setProducts(list.products);
        setStatus("ready");
    }

    function showError(error: unknown) {
        setErrorMessage(
            error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
        );
        setStatus("error");
    }

    async function loadProducts(query: SearchQuery) {
        setStatus("loading");
        setErrorMessage("");

        try {
            showResult(await fetchProducts(query));
        } catch (error) {
            showError(error);
        }
    }

    useEffect(() => {
        loadProducts(defaultQuery);
    }, []);

    function saveProduct(draft: ProductDraft) {
        if (editingProduct) {
            
            setProducts(products.map(item => 
                item.id === editingProduct.id ? { ...item, ...draft } : item
            ));
            setEditingProduct(null); 
        } else {
           
            const newProduct: Product = {
                id: Date.now(),
                ...draft,
            };
            setProducts([...products, newProduct]);
        }
        setStatus("ready");
    }

    
    function removeProduct(id: number) {
        
        setProducts(products.filter(item => item.id !== id));
        
        
        if (editingProduct?.id === id) {
            setEditingProduct(null);
        }
    }

    
    function handleCancel() {
        setEditingProduct(null);
    }

    return (
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", color: "#1f2937", background: "#ffffff", fontFamily: "system-ui, sans-serif" }}>
            <header style={{ marginBottom: 28 }}>
                <h1 style={{ margin: 0, fontSize: 32, color: "#111827" }}>รายการสินค้า</h1>
                <p style={{ margin: "8px 0 0", color: "#6b7280" }}>ดูข้อมูลสินค้า ราคา และรายละเอียดได้ในที่เดียว</p>
            </header>

            <section style={{ padding: 24, marginBottom: 24, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12 }}>
                <h2 style={{ margin: "0 0 16px", fontSize: 20 }}>{editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h2>
                <ProductForm
                    key={editingProduct ? editingProduct.id : "new"} 
                    editing={editingProduct}
                    onSave={saveProduct}
                    onCancel={handleCancel}
                />
            </section>

            <section style={{ padding: 24, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12 }}>
                <h2 style={{ margin: "0 0 16px", fontSize: 20 }}>ค้นหาสินค้า</h2>
                <ProductSearchForm onSearch={loadProducts} />

            <section aria-live="polite" style={{ marginTop: 24, color: "#1f2937" }}>
                {status === "idle" && <p>กรอกข้อมูลและคลิกปุ่มค้นหาเพื่อเริ่ม</p>}

                {status === "loading" && <p>กำลังโหลดข้อมูล...</p>}

                {status === "error" && (
                    <p role="alert">{errorMessage}</p>
                )}

                {status === "ready" && products.length === 0 && (
                    <p>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
                )}

                {status === "ready" && products.length > 0 && (
                    <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 8 }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                                <tr>
                                    {[
                                        "รูปภาพ",
                                        "ชื่อสินค้า",
                                        "ราคา",
                                        "คงเหลือ",
                                        "หมวดหมู่",
                                        "รายละเอียด",
                                        "คะแนน",
                                        "ส่วนลด (%)",
                                        "จัดการ", 
                                    ].map((heading) => (
                                        <th key={heading} style={{ padding: "12px 14px", background: "#f3f4f6", color: "#374151", whiteSpace: "nowrap", borderBottom: "1px solid #e5e7eb" }}>{heading}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                        <td style={{ padding: "12px 14px" }}>
                                            {item.thumbnail && (
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }}
                                                />
                                            )}
                                        </td>
                                        <td style={{ padding: "12px 14px", fontWeight: 600 }}>{item.title}</td>
                                        <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>{item.price} บาท</td>
                                        <td style={{ padding: "12px 14px" }}>{item.stock}</td>
                                        <td style={{ padding: "12px 14px" }}>{item.category}</td>
                                        <td style={{ padding: "12px 14px", minWidth: 200, color: "#4b5563" }}>{item.description}</td>
                                        <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>⭐ {item.rating}</td>
                                        <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>{item.discountPercentage}%</td>
                                        
                                        <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                                            <button style={{ marginRight: 8, padding: "7px 12px", border: 0, borderRadius: 6, background: "#2563eb", color: "white", cursor: "pointer" }} onClick={() => setEditingProduct(item)}>
                                                แก้ไข
                                            </button>
                                            <button style={{ padding: "7px 12px", border: 0, borderRadius: 6, background: "#fee2e2", color: "#b91c1c", cursor: "pointer" }} onClick={() => removeProduct(item.id)}>
                                                ลบ
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
            </section>
        </main>
    );
}