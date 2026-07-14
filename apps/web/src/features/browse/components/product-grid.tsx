"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./product-card";

interface Product {
  id: string;
  title: string;
  description: string;
  price_paise: number;
  original_price_paise?: number;
  category?: { name: string };
  seller?: { full_name: string };
  rating: number;
  review_count: number;
  tags: string[];
  sales_count: number;
}

const FALLBACK_PRODUCTS = [
  {
    id: "1",
    title: "Next.js SaaS Starter Kit",
    description: "Full-featured SaaS boilerplate with auth, billing, and admin dashboard.",
    price_paise: 99900,
    original_price_paise: 199900,
    category: { name: "Boilerplates" },
    seller: { full_name: "Rahul Verma" },
    rating: 4.8,
    review_count: 124,
    tags: ["Next.js", "TypeScript", "Tailwind"],
    sales_count: 89,
  },
  {
    id: "2",
    title: "Tailwind Admin Dashboard",
    description: "Modern admin template with 50+ components and dark mode support.",
    price_paise: 49900,
    original_price_paise: 99900,
    category: { name: "UI Kits" },
    seller: { full_name: "Priya Sharma" },
    rating: 4.6,
    review_count: 89,
    tags: ["Tailwind", "React", "Dashboard"],
    sales_count: 56,
  },
  {
    id: "3",
    title: "React Portfolio Template",
    description: "Beautiful portfolio template for developers with blog and project showcase.",
    price_paise: 24900,
    category: { name: "Web Templates" },
    seller: { full_name: "Sneha Reddy" },
    rating: 4.9,
    review_count: 201,
    tags: ["React", "Portfolio", "Responsive"],
    sales_count: 134,
  },
  {
    id: "4",
    title: "Flutter E-commerce App",
    description: "Complete e-commerce mobile app with cart, checkout, and payment integration.",
    price_paise: 149900,
    original_price_paise: 299900,
    category: { name: "Mobile Apps" },
    seller: { full_name: "Amit Kumar" },
    rating: 4.7,
    review_count: 67,
    tags: ["Flutter", "Dart", "E-commerce"],
    sales_count: 42,
  },
  {
    id: "5",
    title: "B.Tech Major Project - AI Chatbot",
    description: "Python-based AI chatbot with NLP, trained on custom datasets. Fully documented.",
    price_paise: 39900,
    category: { name: "B.Tech Projects" },
    seller: { full_name: "Vikash Singh" },
    rating: 4.5,
    review_count: 156,
    tags: ["Python", "NLP", "AI"],
    sales_count: 98,
  },
  {
    id: "6",
    title: "REST API Template - Node.js",
    description: "Production-ready REST API boilerplate with JWT auth, rate limiting, and docs.",
    price_paise: 34900,
    category: { name: "API Templates" },
    seller: { full_name: "Neha Gupta" },
    rating: 4.8,
    review_count: 93,
    tags: ["Node.js", "Express", "REST"],
    sales_count: 67,
  },
  {
    id: "7",
    title: "Vue.js Landing Page Kit",
    description: "10+ landing page templates built with Vue 3 and Tailwind CSS.",
    price_paise: 59900,
    original_price_paise: 89900,
    category: { name: "Web Templates" },
    seller: { full_name: "Rahul Verma" },
    rating: 4.4,
    review_count: 45,
    tags: ["Vue", "Tailwind", "Landing"],
    sales_count: 31,
  },
  {
    id: "8",
    title: "React Native Fitness App",
    description: "Cross-platform fitness tracking app with workout plans and progress charts.",
    price_paise: 79900,
    category: { name: "Mobile Apps" },
    seller: { full_name: "Priya Sharma" },
    rating: 4.6,
    review_count: 78,
    tags: ["React Native", "Fitness", "Health"],
    sales_count: 53,
  },
];

interface ProductGridProps {
  searchQuery?: string;
  categoryFilter?: string;
}

export function ProductGrid({ searchQuery = "", categoryFilter = "" }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (categoryFilter) params.set("category", categoryFilter);

        const response = await fetch(`${apiUrl}/api/products?${params.toString()}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && result.data.length > 0) {
            setProducts(result.data);
          }
        }
      } catch (error) {
        console.log("Using fallback product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, categoryFilter]);

  // Client-side filtering for fallback data
  const filteredProducts = products.filter((product) => {
    const matchesSearch = !searchQuery ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !categoryFilter ||
      product.category?.name.toLowerCase().replace(/\s+/g, "-") === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-slate-200 rounded-t-xl" />
            <div className="p-4 space-y-3 border border-t-0 border-slate-200 rounded-b-xl">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 text-lg">No products found</p>
        <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          description={product.description || ""}
          price={product.price_paise / 100}
          originalPrice={product.original_price_paise ? product.original_price_paise / 100 : undefined}
          category={product.category?.name || "Uncategorized"}
          seller={product.seller?.full_name || "Unknown"}
          rating={product.rating}
          reviews={product.review_count}
          tags={product.tags || []}
        />
      ))}
    </div>
  );
}
