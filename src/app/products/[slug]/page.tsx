import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DemoRequestForm } from "@/src/components/forms/DemoRequestForm";
import { ProductDetailPage } from "@/src/components/products/ProductDetailPage";
import { products } from "@/src/data/products";

type ProductPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return product ? { title: product.name, description: product.description } : { title: "Product not found" };
}

export default async function ProductDetailRoute({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <><ProductDetailPage product={product} /><section className="container-shell py-20 sm:py-28" id="demo"><DemoRequestForm productName={product.name} /></section></>;
}
