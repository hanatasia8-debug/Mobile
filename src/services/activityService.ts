import { hobbies } from '@/data/hobbies';
import { API_BASE_URL, requestExternalApi } from '@/services/api';
import {
  type ExternalPostsResponse,
  type ExternalPostRaw,
  type ExternalUsersResponse,
  type ExternalUserRaw,
} from '@/types/api';
import {
  type CampusDiscussion,
  type CommunityHost,
  type HobbyData,
} from '@/types/activity';
import { delay } from '@/utils/delay';

/**
 * Service Kegiatan & Komunitas Kampus
 * Sesuai Kriteria Penilaian Pekan Demo Modul 3:
 * 
 * 1. Mengambil data dari External API dan memasukkannya ke dalam Object menggunakan Interface:
 *    - fetchExternalCommunityHosts(): mengambil data dari https://dummyjson.com/users dan mapping ke interface CommunityHost
 *    - fetchExternalDiscussions(): mengambil data dari https://dummyjson.com/posts dan mapping ke interface CampusDiscussion
 * 
 * 2. Menggunakan Custom & Pre-built Async Function:
 *    - Custom async function: fetchActivities, fetchActivityById, fetchExternalCommunityHosts, dsb.
 *    - Pre-built async function: fetch(), response.json()
 * 
 * 3. Menggunakan fungsi .then(), .resolve(), dan .reject():
 *    - requestExternalApi(): menggunakan .then(), resolve(), reject()
 *    - joinActivityWithPromise(): Promise custom dengan resolve() dan reject() untuk validasi kuota
 */

/**
 * Custom Async Function untuk mengambil daftar kegiatan mahasiswa (GatherIn)
 * Mensimulasikan network fetching dengan delay asynchronous
 */
export async function fetchActivities(): Promise<HobbyData[]> {
  // Simulasi latency jaringan server
  await delay(400);
  return [...hobbies];
}

/**
 * Custom Async Function untuk mengambil detail kegiatan berdasarkan ID
 */
export async function fetchActivityById(id: string): Promise<HobbyData> {
  await delay(300);
  const found = hobbies.find((item) => item.id === id);
  if (!found) {
    throw new Error(`Kegiatan dengan ID "${id}" tidak ditemukan.`);
  }
  return found;
}

/**
 * Custom Async Function: Mengambil data User dari External API
 * dan memasukkannya ke dalam Object menggunakan Interface `CommunityHost`
 * 
 * Memenuhi Kriteria Penilaian Modul 3:
 * "Mengambil data dari External API dan memasukkannya ke dalam Object menggunakan Interface"
 */
export async function fetchExternalCommunityHosts(): Promise<CommunityHost[]> {
  const endpoint = `${API_BASE_URL}/users?limit=6&select=id,firstName,lastName,university,image,email,company`;

  // Memanggil external API dengan wrapper Promise
  const responseData = await requestExternalApi<ExternalUsersResponse>(endpoint);

  // Mapping data raw API eksternal ke dalam array of Object bertipe interface CommunityHost
  const communityHosts: CommunityHost[] = responseData.users.map(
    (rawUser: ExternalUserRaw): CommunityHost => {
      // Pembentukan Object baru berdasarkan interface CommunityHost
      const hostObject: CommunityHost = {
        id: String(rawUser.id),
        fullName: `${rawUser.firstName} ${rawUser.lastName}`,
        university: rawUser.university || 'Universitas Muhammadiyah Malang',
        department: rawUser.company?.department || 'Informatika UMM',
        role: rawUser.company?.title || 'Koordinator Hobi',
        avatarUrl: rawUser.image,
        email: rawUser.email,
      };

      return hostObject;
    }
  );

  return communityHosts;
}

/**
 * Custom Async Function: Mengambil data Post dari External API
 * dan memasukkannya ke dalam Object menggunakan Interface `CampusDiscussion`
 */
export async function fetchExternalDiscussions(): Promise<CampusDiscussion[]> {
  const endpoint = `${API_BASE_URL}/posts?limit=5`;

  const responseData = await requestExternalApi<ExternalPostsResponse>(endpoint);

  // Mapping data JSON mentah ke dalam Object yang mengimplementasikan interface CampusDiscussion
  const discussions: CampusDiscussion[] = responseData.posts.map(
    (rawPost: ExternalPostRaw): CampusDiscussion => {
      const discussionObject: CampusDiscussion = {
        id: String(rawPost.id),
        title: rawPost.title,
        content: rawPost.body,
        tags: rawPost.tags,
        likes: rawPost.reactions?.likes ?? 0,
        views: rawPost.views ?? 0,
        authorId: rawPost.userId,
      };

      return discussionObject;
    }
  );

  return discussions;
}

/**
 * Custom Promise Function dengan Resolve dan Reject
 * Memenuhi Kriteria Penilaian: "Menggunakan fungsi .then(), .resolve(), dan .reject()"
 * 
 * Fungsi ini memvalidasi pendaftaran slot kegiatan secara asynchronous:
 * - Jika kuota penuh atau user sudah bergabung: memanggil reject() dengan Error
 * - Jika slot masih tersedia: memanggil resolve() dengan pesan sukses
 */
export function joinActivityWithPromise(activity: HobbyData): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    // Simulasi pemrosesan di server selama 500ms
    setTimeout(() => {
      if (activity.isJoined) {
        // Pemanggilan reject() ketika kondisi bisnis gagal
        reject(
          new Error(`Kamu sudah terdaftar di kegiatan "${activity.name}".`)
        );
        return;
      }

      if (activity.members >= activity.maxMembers) {
        // Pemanggilan reject() ketika kuota sudah habis
        reject(
          new Error(`Maaf, kuota kegiatan "${activity.name}" sudah penuh!`)
        );
        return;
      }

      // Pemanggilan resolve() ketika validasi berhasil
      resolve(
        `Berhasil bergabung dengan "${activity.name}"! Sisa slot kuota telah dikurangi.`
      );
    }, 500);
  });
}

/**
 * Contoh fungsi yang menggunakan method .then() secara chaining
 * Sesuai Modul 3 Bab 1.4 (.then())
 */
export function fetchTotalExternalUsersCount(): Promise<number> {
  return requestExternalApi<ExternalUsersResponse>(`${API_BASE_URL}/users?limit=1`)
    .then((response) => {
      // Mengembalikan nilai baru yang dibungkus oleh Promise baru secara otomatis
      return response.total;
    });
}

