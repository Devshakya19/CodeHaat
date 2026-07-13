"use client";

import { ProductCard } from "./product-card";

const SAMPLE_PRODUCTS = [
  {
    title: "Next.js SaaS Starter Kit",
    description: "Full-featured SaaS boilerplate with auth, billing, and admin dashboard.",
    price: 999,
    originalPrice: 1999,
    category: "Boilerplates",
    seller: "Rahul Verma",
    rating: 4.8,
    reviews: 124,
    tags: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    title: "Tailwind Admin Dashboard",
    description: "Modern admin template with 50+ components and dark mode support.",
    price: 499,
    originalPrice: 999,
    category: "UI Kits",
    seller: "Priya Sharma",
    rating: 4.6,
    reviews: 89,
    tags: ["Tailwind", "React", "Dashboard"],
  },
  {
    title: "React Portfolio Template",
    description: "Beautiful portfolio template for developers with blog and project showcase.",
    price: 249,
    category: "Web Templates",
    seller: "Sneha Reddy",
    rating: 4.9,
    reviews: 201,
    tags: ["React", "Portfolio", "Responsive"],
  },
  {
    title: "Flutter E-commerce App",
    description: "Complete e-commerce mobile app with cart, checkout, and payment integration.",
    price: 1499,
    originalPrice: 2999,
    category: "Mobile Apps",
    seller: "Amit Kumar",
    rating: 4.7,
    reviews: 67,
    tags: ["Flutter", "Dart", "E-commerce"],
  },
  {
    title: "B.Tech Major Project - AI Chatbot",
    description: "Python-based AI chatbot with NLP, trained on custom datasets. Fully documented.",
    price: 399,
    category: "B.Tech Projects",
    seller: "Vikash Singh",
    rating: 4.5,
    reviews: 156,
    tags: ["Python", "NLP", "AI"],
  },
  {
    title: "REST API Template - Node.js",
    description: "Production-ready REST API boilerplate with JWT auth, rate limiting, and docs.",
    price: 349,
    category: "API Templates",
    seller: "Neha Gupta",
    rating: 4.8,
    reviews: 93,
    tags: ["Node.js", "Express", "REST"],
  },
  {
    title: "Vue.js Landing Page Kit",
    description: "10+ landing page templates built with Vue 3 and Tailwind CSS.",
    price: 599,
    originalPrice: 899,
    category: "Web Templates",
    seller: "Rahul Verma",
    rating: 4.4,
    reviews: 45,
    tags: ["Vue", "Tailwind", "Landing"],
  },
  {
    title: "React Native Fitness App",
    description: "Cross-platform fitness tracking app with workout plans and progress charts.",
    price: 799,
    category: "Mobile Apps",
    seller: "Priya Sharma",
    rating: 4.6,
    reviews: 78,
    tags: ["React Native", "Fitness", "Health"],
  },
];

export function ProductGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {SAMPLE_PRODUCTS.map((product) => (
        <ProductCard key={product.title} {...product} />
      ))}
    </div>
  );
}
