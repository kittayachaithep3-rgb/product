"use client";

import { useState } from "react";
import { defaultQuery, fetchProducts } from "../lib/product";
import type { Product, ProductList, SearchQuery } from "../lib/product";

type LoadState = "idle" | "loading" | "error" | "ready";

export default function ProductExplorer() {
    const [products, setProducts] = useState<Product[]>([]);
    const [status, setStatus] = useState<LoadState>("idle");
    const [errorMessage, setErrorMessage] = useState("");

    function showResult(list: ProductList) {
        setProducts(list.products);
        setStatus("ready");
        console.log(products);
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

    return (
        <main
        >
            <h1>รายการสินค้า</h1>
            <p>
                ดูข้อมูลสินค้า ราคา และรายละเอียดได้ในที่เดียว
            </p>

            <button
                type="button"
                onClick={() => loadProducts(defaultQuery)}
                disabled={status === "loading"}
            >
                {status === "loading" ? "กำลังโหลด" : "โหลดข้อมูล"}
            </button>

            <section aria-live="polite">
                {status === "idle" && <p>คลิกปุ่มโหลดข้อมูลเพื่อเริ่ม</p>}

                {status === "loading" && <p>กำลังโหลดข้อมูล...</p>}

                {status === "error" && (
                    <p role="alert">
                        {errorMessage}
                    </p>
                )}

                {status === "ready" && products.length === 0 && (
                    <p>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
                )}

                {status === "ready" && products.length > 0 && (
                    <div>
                    <table>
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
                                    "แท็ก",
                                    "ส่วนลด (%)",
                                ].map((heading) => (
                                    <th key={heading}>
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.thumbnail && (
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                            />
                                        )}
                                    </td>
                                    <td>{item.title}</td>
                                    <td>{item.price} บาท</td>
                                    <td>{item.stock}</td>
                                    <td>{item.category}</td>
                                    <td>{item.description}</td>
                                    <td>⭐ {item.rating}</td>
                                    <td>
                                        {item.tags && item.tags.length > 0 && (
                                            <ul>
                                                {item.tags.map((tag, index) => (
                                                    <li key={index}>{tag}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </td>
                                    <td>{item.discountPercentage}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )}
        </section>
        </main >
    );
}
