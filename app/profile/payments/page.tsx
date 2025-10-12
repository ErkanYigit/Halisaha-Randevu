"use client";
import { useEffect, useState } from "react";
import { Box, Flex, Text, Badge, VStack, Spinner } from "@chakra-ui/react";
import { FaCreditCard, FaMoneyCheckAlt } from "react-icons/fa";

interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/balance/history")
      .then(res => res.json())
      .then(data => setPayments(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box minH="100vh" bgGradient="linear(to-br, #4f1c96, #6d28d9, #a21caf)" p={6}>
      <Text fontSize="3xl" fontWeight="bold" color="white" mb={8}>Bakiye Yükleme Geçmişim</Text>
      {loading ? (
        <Flex justify="center" align="center" minH="200px"><Spinner size="xl" color="yellow.400" /></Flex>
      ) : payments.length === 0 ? (
        <Flex justify="center" align="center" minH="200px">
          <Text color="whiteAlpha.800" fontSize="xl">Hiç bakiye yüklemesi yapılmamış.</Text>
        </Flex>
      ) : (
        <VStack spacing={6} align="stretch">
          {payments.map(pay => (
            <Box key={pay.id} bg="whiteAlpha.200" borderRadius="xl" p={6} boxShadow="md">
              <Flex align="center" gap={4} mb={2}>
                {pay.method === "card" ? <FaCreditCard size={32} color="#fbbf24" /> : <FaMoneyCheckAlt size={32} color="#38b2ac" />}
                <Box flex={1}>
                  <Text fontSize="xl" fontWeight="bold" color="white">₺{pay.amount.toLocaleString("tr-TR")}</Text>
                  <Flex align="center" gap={2} color="whiteAlpha.800" fontSize="md">
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
    </Box>
  );
} 