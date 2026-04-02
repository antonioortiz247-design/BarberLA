export interface Service {
  id: number;
  name: string;
  price: number;
  duration: string;
  icon?: string;
  featured: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  featured: boolean;
}

export interface Booking {
  id: number;
  service_id: number;
  date: string;
  time: string;
  name: string;
  phone: string;
  proof: string;
  status: 'Pendiente' | 'Confirmada' | 'Cancelada';
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
