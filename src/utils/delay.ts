/**
 * Helper delay untuk mensimulasikan waktu tunggu / latency jaringan secara asynchronous.
 * Sesuai Modul 3 Bab 3 (utils/delay.ts)
 * 
 * Menggunakan konstruktor Promise dengan callback resolve().
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

