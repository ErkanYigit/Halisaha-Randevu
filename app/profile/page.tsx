'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Flex,
  VStack,
  Text,
  Avatar,
  IconButton,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
  Badge,
  Select,
} from "@chakra-ui/react";
import { EmailIcon, PhoneIcon, EditIcon, UnlockIcon } from "@chakra-ui/icons";
import { FaMapMarkerAlt, FaHistory, FaCreditCard, FaCog, FaFutbol, FaCheckCircle, FaTimesCircle, FaMoneyCheckAlt } from "react-icons/fa";
import turkeyCities from '../../public/turkey-cities.json';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  createdAt: string;
  lastLogin: string | null;
  phoneVerified: boolean;
  balance?: number;
}

interface Appointment {
  id: string;
  fieldName: string;
  fieldLocation: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  depositPaid: boolean;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  date: string;
}

type CityType = { name: string; districts: string[] };
const cities: CityType[] = turkeyCities as CityType[];

export default function ProfilePage() {
  const { theme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const toast = useToast();
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number | null>(null);
  const [isTopupLoading, setIsTopupLoading] = useState(false);
  const [topupStep, setTopupStep] = useState<'amount' | 'method'>('amount');
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'other' | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showPayments, setShowPayments] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (!response.ok) throw new Error("Profil bilgileri alınamadı");
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          location: data.location || "",
        });
      } catch (error) {}
    };
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedDistrict("");
    setFormData((prev) => ({ ...prev, location: city }));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setFormData((prev) => ({ ...prev, location: `${selectedCity}/${district}` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Profil güncellenemedi");
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {}
  };

  // Şifre kuralları kontrolü
  function validatePassword(pw: string) {
    if (pw.length < 8) return "Şifre en az 8 karakter olmalı.";
    if (!/[A-Z]/.test(pw)) return "Şifre en az bir büyük harf içermeli.";
    if (!/[a-z]/.test(pw)) return "Şifre en az bir küçük harf içermeli.";
    if (!/[0-9]/.test(pw)) return "Şifre en az bir rakam içermeli.";
    return "";
  }

  const handlePasswordChange = async () => {
    setPasswordError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Tüm alanları doldurun.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Yeni şifreler eşleşmiyor.");
      return;
    }
    const ruleError = validatePassword(newPassword);
    if (ruleError) {
      setPasswordError(ruleError);
      return;
    }
    // API isteği
    try {
      const res = await fetch("/api/user/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPasswordError(data.error || "Bir hata oluştu.");
        return;
      }
      toast({ title: "Şifre başarıyla değiştirildi!", status: "success" });
      setIsPasswordModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError("Sunucu hatası.");
    }
  };

  // Bakiye yükleme fonksiyonu
  const handleTopup = async () => {
    setIsTopupLoading(true);
    try {
      const response = await fetch("/api/balance/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile?.id, amount: topupAmount })
      });
      const data = await response.json();
      if (data.success) {
        setProfile((prev) => prev ? { ...prev, balance: data.newBalance } : prev);
        toast({ title: "Bakiye başarıyla yüklendi!", status: "success" });
        setIsTopupModalOpen(false);
        setTopupAmount(null);
        setCustomAmount(null);
        setTopupStep('amount');
        setSelectedMethod(null);
      } else {
        toast({ title: "Bakiye yüklenemedi!", status: "error" });
      }
    } catch (e) {
      toast({ title: "Sunucu hatası!", status: "error" });
    }
    setIsTopupLoading(false);
  };

  // Geçmiş randevu içeriği
  const HistoryModal = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      fetch("/api/appointments/history")
        .then(res => res.json())
        .then(data => setAppointments(data))
        .finally(() => setLoading(false));
    }, []);
    return (
      <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} size="4xl">
        <ModalOverlay />
        <ModalContent bgGradient={
          theme === 'default'
            ? "linear(to-br, #4f1c96, #6d28d9, #a21caf)"
            : theme === 'third'
              ? "linear(to-br, #111111, #222222, #333333)"
              : "linear(to-br, #f0f9ff, #e0f2fe, #dbeafe)"
        }>
          <ModalHeader color={theme === 'light' ? "gray.800" : theme === 'third' ? "#e5e5e5" : "white"}>Geçmiş Randevularım</ModalHeader>
          <ModalCloseButton color={theme === 'light' ? "gray.800" : theme === 'third' ? "#e5e5e5" : "white"} />
          <ModalBody>
            {loading ? (
              <Flex justify="center" align="center" minH="200px"><Spinner size="xl" color="yellow.400" /></Flex>
            ) : appointments.length === 0 ? (
              <Flex justify="center" align="center" minH="200px">
                <Text color={theme === 'light' ? "gray.600" : "whiteAlpha.800"} fontSize="xl">Henüz geçmiş randevunuz yok.</Text>
              </Flex>
            ) : (
              <VStack spacing={6} align="stretch">
                {appointments.map(app => (
                  <Box key={app.id} bg={theme === 'light' ? "gray.100" : "whiteAlpha.200"} borderRadius="xl" p={6} boxShadow="md">
                    <Flex align="center" gap={4} mb={2}>
                      <FaFutbol size={32} color="#fbbf24" />
                      <Box flex={1}>
                        <Text fontSize="xl" fontWeight="bold" color={theme === 'light' ? "gray.800" : "white"}>{app.fieldName}</Text>
                        <Flex align="center" gap={2} color={theme === 'light' ? "gray.600" : "whiteAlpha.800"} fontSize="md">
                          <FaMapMarkerAlt />
                          <Text>{app.fieldLocation}</Text>
                        </Flex>
                      </Box>
                      <Badge colorScheme={app.depositPaid ? "green" : "red"} fontSize="md" px={3} py={1} borderRadius="md">
                        {app.depositPaid ? (
                          <Flex align="center" gap={1}><FaCheckCircle /> Ödendi</Flex>
                        ) : (
                          <Flex align="center" gap={1}><FaTimesCircle /> Bekliyor</Flex>
                        )}
                      </Badge>
                    </Flex>
                    <Flex gap={4} color="whiteAlpha.900" fontSize="md">
                      <Text>Tarih: {new Date(app.date).toLocaleDateString("tr-TR")}</Text>
                      <Text>Saat: {app.startTime.slice(0,5)} - {app.endTime.slice(0,5)}</Text>
                      <Text>Durum: {app.status === "completed" ? "Tamamlandı" : app.status}</Text>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  // Ödeme geçmişi içeriği
  const PaymentsModal = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      fetch("/api/balance/history")
        .then(res => res.json())
        .then(data => setPayments(data))
        .finally(() => setLoading(false));
    }, []);
    return (
      <Modal isOpen={showPayments} onClose={() => setShowPayments(false)} size="4xl">
        <ModalOverlay />
        <ModalContent bgGradient={
          theme === 'default'
            ? "linear(to-br, #4f1c96, #6d28d9, #a21caf)"
            : theme === 'third'
              ? "linear(to-br, #111111, #222222, #333333)"
              : "linear(to-br, #f0f9ff, #e0f2fe, #dbeafe)"
        }>
          <ModalHeader color={theme === 'light' ? "gray.800" : "white"}>Bakiye Yükleme Geçmişim</ModalHeader>
          <ModalCloseButton color={theme === 'light' ? "gray.800" : "white"} />
          <ModalBody>
            {loading ? (
              <Flex justify="center" align="center" minH="200px"><Spinner size="xl" color="yellow.400" /></Flex>
            ) : payments.length === 0 ? (
              <Flex justify="center" align="center" minH="200px">
                <Text color={theme === 'light' ? "gray.600" : "whiteAlpha.800"} fontSize="xl">Hiç bakiye yüklemesi yapılmamış.</Text>
              </Flex>
            ) : (
              <VStack spacing={6} align="stretch">
                {payments.map(pay => (
                  <Box key={pay.id} bg={theme === 'light' ? "gray.100" : "whiteAlpha.200"} borderRadius="xl" p={6} boxShadow="md">
                    <Flex align="center" gap={4} mb={2}>
                      {pay.method === "card" ? <FaCreditCard size={32} color="#fbbf24" /> : <FaMoneyCheckAlt size={32} color="#38b2ac" />}
                      <Box flex={1}>
                        <Text fontSize="xl" fontWeight="bold" color={theme === 'light' ? "gray.800" : "white"}>₺{pay.amount.toLocaleString("tr-TR")}</Text>
                        <Flex align="center" gap={2} color={theme === 'light' ? "gray.600" : "whiteAlpha.800"} fontSize="md">
                          <Text>Yöntem: {pay.method === "card" ? "Kart" : "Diğer"}</Text>
                        </Flex>
                      </Box>
                      <Badge colorScheme="yellow" fontSize="md" px={3} py={1} borderRadius="md">
                        {new Date(pay.date).toLocaleString("tr-TR")}
                      </Badge>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  if (status === "loading") {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Box minH="100vh" bgGradient={
      theme === 'default' 
        ? "linear(to-br, #4f1c96, #6d28d9, #a21caf)" 
        : theme === 'third'
          ? "linear(to-br, black, #111111, #222222)"
          : "linear(to-br, #f0f9ff, #e0f2fe, #dbeafe)"
    } p={6}>
      <Flex direction="column" align="center" maxW="3xl" mx="auto" gap={8}>
        {/* Profil Kartı */}
        <Box w="full" bg={
          theme === 'default' 
            ? "whiteAlpha.200" 
            : theme === 'third'
              ? "#111111"
              : "white"
        } borderRadius="2xl" p={8} boxShadow="lg" mb={4}>
          <Flex align="center" gap={6}>
            <Box pos="relative">
              <Avatar size="2xl" name={profile?.name || "Kullanıcı"} />
              {/* Düzenle butonu kaldırıldı */}
            </Box>
            <Box flex={1} color={
              theme === 'default' 
                ? "white" 
                : theme === 'third'
                  ? "#e5e5e5"
                  : "gray.800"
            }>
              <Text fontSize="3xl" fontWeight="bold">{profile?.name}</Text>
              <HStack spacing={4} mt={2} flexWrap="wrap">
                <HStack><EmailIcon /> <Text>{profile?.email}</Text></HStack>
                {profile?.phone && <HStack><PhoneIcon /> <Text>{profile.phone}</Text></HStack>}
                {profile?.location && <HStack><FaMapMarkerAlt /> <Text>{profile.location.replace("/", ", ")}</Text></HStack>}
              </HStack>
              {/* Bakiye Alanı */}
              <Flex align="center" gap={2} mt={2}>
                <Text fontSize="lg" fontWeight="bold">Bakiye:</Text>
                <Text fontSize="lg" color="green.200">{profile?.balance?.toLocaleString("tr-TR", { style: "currency", currency: "TRY" }) ?? "-"}</Text>
                <Button size="sm" colorScheme="yellow" variant="solid" onClick={() => { setIsTopupModalOpen(true); setTopupStep('amount'); setTopupAmount(null); setCustomAmount(null); setSelectedMethod(null); }}>Bakiye Yükle</Button>
              </Flex>
              <Text mt={2} fontSize="md" color={theme === 'third' ? "#999999" : "whiteAlpha.800"}>Kayıt: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("tr-TR") : "-"}</Text>
            </Box>
            <VStack gap={2}>
              {/* Sadece şifre değiştir ve çıkış yap butonları kaldı */}
              <Button leftIcon={<UnlockIcon />} colorScheme="pink" variant="solid" w="32" onClick={() => setIsPasswordModalOpen(true)}>Şifre Değiştir</Button>
              <Button colorScheme="red" variant="solid" w="32" onClick={() => signOut({ callbackUrl: '/auth/login' })}>Çıkış Yap</Button>
            </VStack>
          </Flex>
        </Box>
        {/* Alt Butonlar */}
        <Flex w="full" gap={6} justify="center">
          <Button 
            leftIcon={<FaHistory />} 
            colorScheme={theme === 'third' ? "blackAlpha" : theme === 'default' ? "whiteAlpha" : "gray"} 
            variant="solid" 
            size="lg" 
            w="40" 
            h="24" 
            fontSize="xl" 
            onClick={() => setShowHistory(true)}
            bg={theme === 'third' ? "#222222" : undefined}
            color={theme === 'third' ? "#e5e5e5" : undefined}
            _hover={theme === 'third' ? { bg: "#333333" } : undefined}
          >
            Geçmiş
          </Button>
          <Button 
            leftIcon={<FaCreditCard />} 
            colorScheme={theme === 'third' ? "blackAlpha" : theme === 'default' ? "whiteAlpha" : "gray"} 
            variant="solid" 
            size="lg" 
            w="40" 
            h="24" 
            fontSize="xl" 
            onClick={() => setShowPayments(true)}
            bg={theme === 'third' ? "#222222" : undefined}
            color={theme === 'third' ? "#e5e5e5" : undefined}
            _hover={theme === 'third' ? { bg: "#333333" } : undefined}
          >
            Ödemeler
          </Button>
          <Button 
            leftIcon={<FaCog />} 
            colorScheme={theme === 'third' ? "blackAlpha" : theme === 'default' ? "whiteAlpha" : "gray"} 
            variant="solid" 
            size="lg" 
            w="40" 
            h="24" 
            fontSize="xl" 
            onClick={() => setIsEditing(true)}
            bg={theme === 'third' ? "#222222" : undefined}
            color={theme === 'third' ? "#e5e5e5" : undefined}
            _hover={theme === 'third' ? { bg: "#333333" } : undefined}
          >
            Ayarlar
          </Button>
        </Flex>
        {/* Profil Düzenleme Modalı */}
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent bgGradient={
            theme === 'default' 
              ? "linear(to-br, #2d006e, #6d28d9, #a21caf)" 
              : theme === 'third'
                ? "linear(to-br, #111111, #222222, #333333)"
                : "linear(to-br, #f0f9ff, #e0f2fe, #dbeafe)"
          } borderRadius="2xl" boxShadow="2xl">
            <ModalHeader color={
              theme === 'default' 
                ? "white" 
                : theme === 'third'
                  ? "#e5e5e5"
                  : "gray.800"
            } fontSize="2xl" fontWeight="extrabold" letterSpacing="wide">Profil Bilgilerini Düzenle</ModalHeader>
            <ModalCloseButton color={
              theme === 'default' 
                ? "white" 
                : theme === 'third'
                  ? "#e5e5e5"
                  : "gray.800"
            } />
            <ModalBody>
              <form id="profile-edit-form" onSubmit={handleSubmit}>
                <VStack gap={5}>
                  <div style={{ width: "100%" }}>
                    <label style={{ 
                      color: theme === 'light' ? '#4a5568' : '#c4b5fd', 
                      fontSize: 13, 
                      fontWeight: 600, 
                      marginBottom: 4, 
                      display: 'block', 
                      letterSpacing: 1 
                    }}>Ad Soyad</label>
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      style={{ 
                        width: '100%', 
                        borderRadius: 16, 
                        padding: 14, 
                        background: theme === 'light' ? 'white' : 'rgba(255,255,255,0.08)', 
                        color: theme === 'light' ? '#2d3748' : 'white', 
                        border: theme === 'light' ? '1.5px solid #e2e8f0' : '1.5px solid #a21caf', 
                        fontSize: 18, 
                        fontWeight: 500, 
                        outline: 'none', 
                        marginTop: 2, 
                        transition: 'border 0.2s' 
                      }} 
                      placeholder="Adınızı girin" 
                    />
                  </div>
                  <div style={{ width: "100%" }}>
                    <label style={{ 
                      color: theme === 'light' ? '#4a5568' : '#c4b5fd', 
                      fontSize: 13, 
                      fontWeight: 600, 
                      marginBottom: 4, 
                      display: 'block', 
                      letterSpacing: 1 
                    }}>E-posta</label>
                    <input 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      readOnly 
                      style={{ 
                        width: '100%', 
                        borderRadius: 16, 
                        padding: 14, 
                        background: theme === 'light' ? '#f7fafc' : 'rgba(255,255,255,0.08)', 
                        color: theme === 'light' ? '#718096' : '#e0e7ff', 
                        border: theme === 'light' ? '1.5px solid #e2e8f0' : '1.5px solid #a21caf', 
                        fontSize: 18, 
                        fontWeight: 500, 
                        outline: 'none', 
                        marginTop: 2, 
                        opacity: 0.7 
                      }} 
                    />
                  </div>
                  <div style={{ width: "100%" }}>
                    <label style={{ 
                      color: theme === 'light' ? '#4a5568' : '#c4b5fd', 
                      fontSize: 13, 
                      fontWeight: 600, 
                      marginBottom: 4, 
                      display: 'block', 
                      letterSpacing: 1 
                    }}>Telefon</label>
                    <input 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      style={{ 
                        width: '100%', 
                        borderRadius: 16, 
                        padding: 14, 
                        background: theme === 'light' ? 'white' : 'rgba(255,255,255,0.08)', 
                        color: theme === 'light' ? '#2d3748' : 'white', 
                        border: theme === 'light' ? '1.5px solid #e2e8f0' : '1.5px solid #a21caf', 
                        fontSize: 18, 
                        fontWeight: 500, 
                        outline: 'none', 
                        marginTop: 2 
                      }} 
                      placeholder="Telefon numarası" 
                    />
                  </div>
                  <div style={{ width: "100%" }}>
                    <label style={{ 
                      color: theme === 'light' ? '#4a5568' : '#c4b5fd', 
                      fontSize: 13, 
                      fontWeight: 600, 
                      marginBottom: 4, 
                      display: 'block', 
                      letterSpacing: 1 
                    }}>Şehir</label>
                    <Select
                      value={selectedCity}
                      onChange={handleCityChange}
                      borderRadius="xl"
                      bgGradient={theme === 'light' ? "linear(to-r, #e2e8f0, #cbd5e0)" : "linear(to-r, #6d28d9, #a21caf)"}
                      color={theme === 'light' ? "#2d3748" : "white"}
                      fontWeight="bold"
                      fontSize="lg"
                      placeholder="Şehir seçin"
                      _placeholder={{ color: theme === 'light' ? "gray.500" : "whiteAlpha.700" }}
                      _focus={{ borderColor: theme === 'light' ? "#4a5568" : "#a21caf" }}
                      mb={selectedCity ? 0 : 2}
                    >
                      {cities.map((city) => (
                        <option key={city.name} value={city.name} style={{ color: theme === 'light' ? "#2d3748" : "#6d28d9" }}>{city.name}</option>
                      ))}
                    </Select>
                  </div>
                  {selectedCity && (
                    <div style={{ width: "100%" }}>
                      <label style={{ 
                        color: theme === 'light' ? '#4a5568' : '#c4b5fd', 
                        fontSize: 13, 
                        fontWeight: 600, 
                        marginBottom: 4, 
                        display: 'block', 
                        letterSpacing: 1 
                      }}>İlçe</label>
                      <Select
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        borderRadius="xl"
                        bgGradient={theme === 'light' ? "linear(to-r, #e2e8f0, #cbd5e0)" : "linear(to-r, #a21caf, #6d28d9)"}
                        color={theme === 'light' ? "#2d3748" : "white"}
                        fontWeight="bold"
                        fontSize="lg"
                        placeholder="İlçe seçin"
                        _placeholder={{ color: theme === 'light' ? "gray.500" : "whiteAlpha.700" }}
                        _focus={{ borderColor: theme === 'light' ? "#4a5568" : "#a21caf" }}
                      >
                        {cities.find((city) => city.name === selectedCity)?.districts.map((district) => (
                          <option key={district} value={district} style={{ color: theme === 'light' ? "#2d3748" : "#a21caf" }}>{district}</option>
                        ))}
                      </Select>
                    </div>
                  )}
                </VStack>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button 
                type="submit" 
                form="profile-edit-form" 
                bgGradient={theme === 'light' ? "linear(to-r, #4a5568, #2d3748)" : "linear(to-r, #a21caf, #6d28d9)"} 
                color="white" 
                _hover={{ 
                  bgGradient: theme === 'light' ? 'linear(to-r, #2d3748, #1a202c)' : 'linear(to-r, #6d28d9, #a21caf)', 
                  boxShadow: theme === 'light' ? '0 0 0 2px #4a5568' : '0 0 0 2px #a21caf' 
                }} 
                borderRadius="xl" 
                px={8} 
                py={6} 
                fontWeight="bold" 
                fontSize="lg" 
                mr={3}
              >
                Kaydet
              </Button>
              <Button 
                onClick={() => setIsEditing(false)} 
                bg={theme === 'light' ? "gray.100" : "whiteAlpha.700"} 
                color={theme === 'light' ? "#4a5568" : "#6d28d9"} 
                _hover={{ 
                  bg: theme === 'light' ? 'gray.200' : 'whiteAlpha.900', 
                  color: theme === 'light' ? '#2d3748' : '#a21caf' 
                }} 
                borderRadius="xl" 
                px={8} 
                py={6} 
                fontWeight="bold" 
                fontSize="lg"
              >
                İptal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Şifre Değiştir</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={3}>
                <FormLabel>Mevcut Şifre</FormLabel>
                <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>Yeni Şifre</FormLabel>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>Yeni Şifre (Tekrar)</FormLabel>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </FormControl>
              {passwordError && <Text color="red.400" fontSize="sm">{passwordError}</Text>}
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setIsPasswordModalOpen(false)} mr={3}>İptal</Button>
              <Button colorScheme="pink" onClick={handlePasswordChange}>Kaydet</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Bakiye Yükleme Modalı */}
        <Modal isOpen={isTopupModalOpen} onClose={() => { setIsTopupModalOpen(false); setTopupStep('amount'); setTopupAmount(null); setCustomAmount(null); setSelectedMethod(null); }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Bakiye Yükle</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {topupStep === 'amount' && (
                <>
                  <Text mb={2}>Tutar Seçin</Text>
                  <Flex gap={2} mb={4} flexWrap="wrap">
                    {[50, 100, 200, 500].map((amt) => (
                      <Button key={amt} colorScheme={topupAmount === amt ? 'yellow' : 'gray'} variant={topupAmount === amt ? 'solid' : 'outline'} onClick={() => { setTopupAmount(amt); setCustomAmount(null); }}>₺{amt}</Button>
                    ))}
                    <Button colorScheme={customAmount !== null ? 'yellow' : 'gray'} variant={customAmount !== null ? 'solid' : 'outline'} onClick={() => { setTopupAmount(null); setCustomAmount(0); }}>Diğer</Button>
                  </Flex>
                  {customAmount !== null && (
                    <FormControl mb={2}>
                      <FormLabel>Diğer Tutar</FormLabel>
                      <Input type="number" min={1} value={customAmount} onChange={e => { setCustomAmount(Number(e.target.value)); setTopupAmount(Number(e.target.value)); }} />
                    </FormControl>
                  )}
                  <Button colorScheme="purple" w="full" mt={2} onClick={() => { if (topupAmount || customAmount) setTopupStep('method'); }}>Devam Et</Button>
                </>
              )}
              {topupStep === 'method' && (
                <>
                  <Text mb={2}>Ödeme Yöntemi Seçin</Text>
                  <Flex gap={2} mb={4} flexWrap="wrap">
                    <Button colorScheme={selectedMethod === 'card' ? 'yellow' : 'gray'} variant={selectedMethod === 'card' ? 'solid' : 'outline'} onClick={() => setSelectedMethod('card')}>Kart ile Yükle</Button>
                    <Button colorScheme={selectedMethod === 'other' ? 'yellow' : 'gray'} variant={selectedMethod === 'other' ? 'solid' : 'outline'} onClick={() => setSelectedMethod('other')}>Diğer Yöntemler</Button>
                  </Flex>
                  {selectedMethod === 'card' && (
                    <Text mb={2} color="green.600">(Test ortamı: Kart ile yükleme işlemi mock olarak yapılacaktır.)</Text>
                  )}
                  {selectedMethod === 'other' && (
                    <Text mb={2} color="blue.600">(Havale/EFT veya diğer yöntemler için lütfen destek ile iletişime geçin.)</Text>
                  )}
                  <Button colorScheme="purple" w="full" mt={2} onClick={handleTopup} isLoading={isTopupLoading} disabled={!selectedMethod}>Yükle</Button>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => { setIsTopupModalOpen(false); setTopupStep('amount'); setTopupAmount(null); setCustomAmount(null); setSelectedMethod(null); }} mr={3}>İptal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Geçmiş ve Ödemeler Modalı */}
        <HistoryModal />
        <PaymentsModal />
      </Flex>
    </Box>
  );
} 