import { Product, Service } from "@/types";

export const defaultServices: Service[] = [
  { id: 1, name: "Corte de Autor", price: 350, duration: "45 min", icon: "fa-cut", featured: true },
  { id: 2, name: "Ritual de Barba", price: 250, duration: "30 min", icon: "fa-broom", featured: true },
  { id: 3, name: "Corte + Barba", price: 500, duration: "75 min", icon: "fa-user-tie", featured: false },
  { id: 4, name: "Perfilado de Ceja", price: 100, duration: "15 min", icon: "fa-eye", featured: false },
];

export const defaultProducts: Product[] = [
  {
    id: 101,
    name: "Playera Barber",
    price: 450,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400",
    featured: true,
  },
  {
    id: 102,
    name: "Gorra Barber Premium",
    price: 380,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=400",
    featured: true,
  },
  {
    id: 103,
    name: "Pomada para Cabello",
    price: 220,
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501c27?auto=format&fit=crop&q=80&w=400",
    featured: false,
  },
  {
    id: 104,
    name: "Aceite para Barba",
    price: 280,
    image: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?auto=format&fit=crop&q=80&w=400",
    featured: false,
  },
];
