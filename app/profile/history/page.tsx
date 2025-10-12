"use client";
import { useEffect, useState } from "react";
import { Box, Flex, Text, Badge, VStack, Spinner } from "@chakra-ui/react";
import { FaFutbol, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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

export default function HistoryPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments/history")
      .then(res => res.json())
      .then(data => setAppointments(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box minH="100vh" bgGradient="linear(to-br, #4f1c96, #6d28d9, #a21caf)" p={6}>
      <Text fontSize="3xl" fontWeight="bold" color="white" mb={8}>Geçmiş Randevularım</Text>
      {loading ? (
        <Flex justify="center" align="center" minH="200px"><Spinner size="xl" color="yellow.400" /></Flex>
      ) : appointments.length === 0 ? (
        <Flex justify="center" align="center" minH="200px">
          <Text color="whiteAlpha.800" fontSize="xl">Henüz geçmiş randevunuz yok.</Text>
        </Flex>
      ) : (
        <VStack spacing={6} align="stretch">
          {appointments.map(app => (
            <Box key={app.id} bg="whiteAlpha.200" borderRadius="xl" p={6} boxShadow="md">
              <Flex align="center" gap={4} mb={2}>
                <FaFutbol size={32} color="#fbbf24" />
                <Box flex={1}>
                  <Text fontSize="xl" fontWeight="bold" color="white">{app.fieldName}</Text>
                  <Flex align="center" gap={2} color="whiteAlpha.800" fontSize="md">
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
    </Box>
  );
} 