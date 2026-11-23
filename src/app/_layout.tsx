import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PALETTE } from '@/styles';

/**
 * KRITERIA MODUL 4: Route Protection Guards (useSegments)
 * Memeriksa status login dan mengarahkan pengguna secara otomatis:
 * - Menampilkan loading spinner saat sesi sedang didekripsi dari SecureStore (mencegah layout flicker)
 * - Mengarahkan tamu yang belum login ke /(auth)/login
 * - Mengarahkan pengguna yang sudah login ke / (beranda) jika berada di halaman login
 * - Mengembalikan pengguna ke /(auth)/login saat sesi berakhir / Sign Out
 */
function RouteGuard() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Jangan lakukan navigasi sebelum inisialisasi selesai
    if (isLoading) return;

    // 2. Periksa apakah rute aktif berada di grup `(auth)`
    const inAuthGroup = (segments[0] as string) === '(auth)';

    if (!session && !inAuthGroup) {
      // Pengguna belum login mencoba masuk area aplikasi pribadi -> Redirect ke /(auth)/login
      router.replace('/(auth)/login' as any);
    } else if (session && inAuthGroup) {
      // Pengguna sudah login tetapi masih di layar login -> Redirect ke Beranda (/)
      router.replace('/');
    }
  }, [session, isLoading, segments, router]);

  // Perisai Pemuatan: Cegah flicker layar saat aplikasi baru pertama dibuka
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: PALETTE.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color={PALETTE.accentLime} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#161B22',
          },
          headerTintColor: '#F0F6FC',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#0D1117',
          },
        }}>
        {/* Rute Grup Otentikasi (Modul 4) */}
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />

        {/* Halaman Utama (Home Screen) - Modul 1-4 */}
        <Stack.Screen
          name="index"
          options={{
            title: 'GatherIn',
            headerShown: true,
          }}
        />

        {/* Dynamic Route: Halaman Detail Kegiatan (Modul 2) */}
        <Stack.Screen
          name="detail/[id]"
          options={{
            title: 'Detail Kegiatan',
            headerShown: true,
            headerBackTitle: 'Kembali',
          }}
        />

        {/* Halaman Favorit (Modul 3 Bab 3 item 15) */}
        <Stack.Screen
          name="favorites"
          options={{
            title: 'Kegiatan Favorit',
            headerShown: true,
            headerBackTitle: 'Beranda',
          }}
        />

        {/* Halaman Pencarian Kegiatan (Modul 3 Bab 3 item 13) */}
        <Stack.Screen
          name="search"
          options={{
            title: 'Pencarian Kegiatan',
            headerShown: true,
            headerBackTitle: 'Beranda',
          }}
        />
      </Stack>
    </>
  );
}

/**
 * Root Layout untuk Stack Navigator
 * Dibungkus dengan AuthProvider untuk ketersediaan sesi global
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard />
    </AuthProvider>
  );
}
