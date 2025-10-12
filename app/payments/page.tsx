'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCreditCard, FaPaypal, FaMoneyBillWave, FaHistory, FaLock, FaCheck } from 'react-icons/fa';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  email?: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    isDefault: true
  },
  {
    id: '2',
    type: 'paypal',
    email: 'user@example.com',
    isDefault: false
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 400,
    date: '2024-03-20',
    status: 'completed',
    description: 'Futbol Arena - 2 Saat Rezervasyon'
  },
  {
    id: '2',
    amount: 350,
    date: '2024-03-15',
    status: 'completed',
    description: 'Spor Kompleksi - 1 Saat Rezervasyon'
  }
];

export default function PaymentsPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [showAddCard, setShowAddCard] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Başlık */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
              Ödeme Yöntemleri
            </h1>
            <p className="text-xl text-white/80">
              Güvenli ve hızlı ödeme seçenekleri
            </p>
          </div>

          {/* Ödeme Yöntemleri */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Kayıtlı Ödeme Yöntemleri</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddCard(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Yeni Kart Ekle
              </motion.button>
            </div>

            <div className="space-y-4">
              {mockPaymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                      {method.type === 'card' ? (
                        <FaCreditCard className="text-2xl text-white" />
                      ) : (
                        <FaPaypal className="text-2xl text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {method.type === 'card' ? `**** **** **** ${method.last4}` : method.email}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {method.type === 'card' ? 'Kredi Kartı' : 'PayPal'}
                      </p>
                    </div>
                  </div>
                  {method.isDefault && (
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                      Varsayılan
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* İşlem Geçmişi */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">İşlem Geçmişi</h2>
            <div className="space-y-4">
              {mockTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                      <FaMoneyBillWave className="text-2xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{transaction.description}</h3>
                      <p className="text-white/60 text-sm">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{transaction.amount} TL</p>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      transaction.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {transaction.status === 'completed' ? 'Tamamlandı' : 
                       transaction.status === 'pending' ? 'Beklemede' : 'Başarısız'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 