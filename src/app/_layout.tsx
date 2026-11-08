import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/**
 * Root Layout untuk Stack Navigator
 * Modul 3: Pemrograman Asynchronous & API Call (GatherIn)
 */
export default function RootLayout() {
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
        {/* Halaman Utama (Home Screen) */}
        <Stack.Screen
          name="index"
          options={{
            title: 'GatherIn',
            headerShown: true,
          }}
        />

        {/* Dynamic Route: Halaman Detail Kegiatan */}
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
