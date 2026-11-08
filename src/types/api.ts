/**
 * Definisi Type & Interface untuk Komunikasi API
 * Sesuai Modul 3: Pemrograman Asynchronous & API Call
 */

/**
 * Generic API Response wrapper standar
 * Sesuai contoh pada Modul 3 Bab 3 (types/api.ts)
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp?: string;
}

/**
 * Interface mentah (raw) data User dari External API (https://dummyjson.com/users)
 * Digunakan untuk menangkap bentuk respons asli dari server eksternal
 */
export interface ExternalUserRaw {
  id: number;
  firstName: string;
  lastName: string;
  university?: string;
  image: string;
  email: string;
  role?: string;
  company?: {
    department: string;
    name: string;
    title: string;
  };
}

/**
 * Interface respons pembungkus untuk list user dari External API
 */
export interface ExternalUsersResponse {
  users: ExternalUserRaw[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Interface mentah (raw) data Post/Diskusi dari External API (https://dummyjson.com/posts)
 */
export interface ExternalPostRaw {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

/**
 * Interface respons pembungkus untuk list post dari External API
 */
export interface ExternalPostsResponse {
  posts: ExternalPostRaw[];
  total: number;
  skip: number;
  limit: number;
}

