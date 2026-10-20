import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/**
 * Root Layout untuk Stack Navigator sesuai Modul 2 Praktikum Pemrograman Mobile
 * Mengelola tumpukan layar (navigation stack) menggunakan <Stack> dan <Stack.Screen>
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
      </Stack>
    </>
  );
}
