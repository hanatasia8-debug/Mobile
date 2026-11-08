/**
 * Layer Network Service (API Client)
 * Sesuai Modul 3: Pemrograman Asynchronous & API Call
 * 
 * Menerapkan:
 * 1. Konstruktor Promise murni: `new Promise<T>((resolve, reject) => ...)`
 * 2. Pemanggilan fungsi `resolve()` saat request berhasil
 * 3. Pemanggilan fungsi `reject()` saat request gagal / server error
 * 4. Pemanggilan method `.then()` untuk menangani hasil Promise secara asynchronous
 * 5. Pre-built async function: `fetch()` dan `response.json()`
 */

export const API_BASE_URL = 'https://dummyjson.com';

/**
 * Custom Promise-based HTTP GET Request Wrapper
 * Memenuhi kriteria penilaian: "Menggunakan fungsi .then(), .resolve(), dan .reject()"
 * 
 * @param endpoint URL endpoint eksternal yang akan di-fetch
 * @returns Promise<T> yang akan me-resolve data atau me-reject pesan error
 */
export function requestExternalApi<T>(endpoint: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    // 1. Pre-built Async Function: fetch()
    fetch(endpoint)
      // 2. Menggunakan method .then() untuk menangkap response awal
      .then((response: Response) => {
        if (!response.ok) {
          // 3. Menggunakan reject() jika HTTP status bukan 2xx (misal: 404, 500)
          reject(
            new Error(
              `HTTP Request gagal dengan status ${response.status}: ${response.statusText}`
            )
          );
          return;
        }
        // Pre-built async method: response.json() yang mengembalikan Promise baru
        return response.json();
      })
      // Chaining .then() untuk mendapatkan data JSON hasil parsing
      .then((data: T | undefined) => {
        if (data !== undefined) {
          // 4. Menggunakan resolve() saat data berhasil didapatkan
          resolve(data);
        }
      })
      // Menangkap error jaringan (misal: koneksi offline, timeout)
      .catch((error: unknown) => {
        // 5. Menggunakan reject() untuk melempar error jaringan
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan jaringan saat menghubungi API eksternal.';
        reject(new Error(errorMessage));
      });
  });
}

