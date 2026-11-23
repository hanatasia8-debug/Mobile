import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { PALETTE } from '@/styles';

/**
 * KRITERIA MODUL 4: Supabase Auth Flow + Mobile UX
 * Halaman Otentikasi Terpadu (Sign In & Sign Up)
 * - Menerapkan sanitasi input (.trim())
 * - Menggunakan keyboardType, autoCapitalize, autoCorrect yang tepat
 * - Menangani loading state & pencegahan multiple submission
 * - Menangkap dan menampilkan error secara aman tanpa crash
 */
export default function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [callsign, setCallsign] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAuth = async () => {
    // 1. Validasi & Sanitasi Input (Mobile UX)
    const cleanEmail = email.trim();
    const cleanFullName = fullName.trim();
    const cleanCallsign = callsign.trim();

    setErrorMessage(null);

    if (!cleanEmail || !password) {
      setErrorMessage('Harap isi email dan password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password minimal terdiri dari 6 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        // Alur Pendaftaran (Sign Up) dengan metadata pengguna
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: cleanFullName || 'Mahasiswa UMM',
              callsign: cleanCallsign || cleanFullName || 'Gatherer',
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (data.session) {
          Alert.alert('Pendaftaran Berhasil! 🎉', 'Selamat datang di GatherIn!');
        } else {
          Alert.alert(
            'Pendaftaran Berhasil!',
            'Akun berhasil dibuat. Anda dapat langsung masuk sekarang.'
          );
          setIsRegistering(false);
        }
      } else {
        // Alur Masuk (Sign In)
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (error) {
          // Tangani pesan kredensial tidak valid tanpa membuat aplikasi crash
          if (error.message.includes('Invalid login credentials')) {
            setErrorMessage('Email atau kata sandi tidak valid. Silakan periksa kembali.');
          } else {
            setErrorMessage(error.message);
          }
          return;
        }

        console.log('[Auth] Berhasil masuk dengan akun:', cleanEmail);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Header Branding */}
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>G</Text>
          </View>
          <Text style={styles.brandTitle}>GatherIn</Text>
        </View>

        <Text style={styles.heroTag}>● MODUL 4: DATABASE & AUTENTIKASI</Text>
        <Text style={styles.title}>
          {isRegistering ? 'Daftar Akun Baru' : 'Selamat Datang Kembali'}
        </Text>
        <Text style={styles.subtitle}>
          {isRegistering
            ? 'Buat akun untuk mengelola acara kumpul komunitas kampusmu.'
            : 'Masuk dengan kredensial Supabase Anda untuk mengakses Markas GatherIn.'}
        </Text>

        {/* Kotak Pesan Error */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        )}

        {/* Form Inputs */}
        <View style={styles.card}>
          {isRegistering && (
            <>
              <Text style={styles.inputLabel}>NAMA LENGKAP</Text>
              <TextInput
                style={styles.input}
                placeholder="cth: Arya Pratama"
                placeholderTextColor="#6E7681"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
              />

              <Text style={styles.inputLabel}>NAMA PANGGILAN / CALLSIGN</Text>
              <TextInput
                style={styles.input}
                placeholder="cth: AryaPro / ShadowRunner"
                placeholderTextColor="#6E7681"
                value={callsign}
                onChangeText={setCallsign}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </>
          )}

          <Text style={styles.inputLabel}>ALAMAT EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="mahasiswa@webmail.umm.ac.id"
            placeholderTextColor="#6E7681"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.inputLabel}>KATA SANDI (MIN. 6 KARAKTER)</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#6E7681"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Tombol Submit Utama */}
          <Pressable
            accessibilityRole="button"
            onPress={handleAuth}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.primaryButton,
              isLoading && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}>
            {isLoading ? (
              <ActivityIndicator color="#0D1117" size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isRegistering ? 'Daftar sebagai Mahasiswa 🚀' : 'Masuk ke Markas GatherIn ➔'}
              </Text>
            )}
          </Pressable>

          {/* Toggle Mode Masuk / Daftar */}
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setIsRegistering(!isRegistering);
              setErrorMessage(null);
            }}
            style={styles.switchButton}>
            <Text style={styles.switchButtonText}>
              {isRegistering
                ? 'Sudah punya akun? Masuk di sini'
                : 'Belum punya kredensial? Daftar akun baru di sini'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footerInfo}>
          Laboratorium Informatika • Universitas Muhammadiyah Malang
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 48,
    paddingBottom: 32,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: PALETTE.accentLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: {
    color: '#0D1117',
    fontSize: 20,
    fontWeight: '900',
  },
  brandTitle: {
    marginLeft: 10,
    color: PALETTE.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  heroTag: {
    fontSize: 10,
    color: PALETTE.accentCyan,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    color: PALETTE.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    color: PALETTE.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: '#381A1D',
    borderWidth: 1,
    borderColor: '#7A272B',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF7B72',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  card: {
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
  },
  inputLabel: {
    color: PALETTE.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#0D1117',
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: PALETTE.textPrimary,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: PALETTE.accentLime,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: '#0D1117',
    fontSize: 14,
    fontWeight: '800',
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 6,
  },
  switchButtonText: {
    color: PALETTE.accentCyan,
    fontSize: 12,
    fontWeight: '600',
  },
  footerInfo: {
    marginTop: 32,
    color: PALETTE.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
});
