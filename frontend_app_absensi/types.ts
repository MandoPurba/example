
export interface Branch {
  id?: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone?: string;
  radius: number,
  latitude: number,
  longitude: number,
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export interface User {
  id: string;
  username: string;
  password: string;
  status: "Active" | "Non-Active";
  bioMetrics: {};
  branch_ids: string[];
  createdAt?: string;
  updatedAt?: string;
}