'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaThumbsUp, FaComment } from 'react-icons/fa';

interface Review {
  id: string;
  fieldName: string;
  location: string;
  rating: number;
  comment: string;
  userName: string;
  date: string;
  likes: number;
  replies: number;
  images?: string[];
}

const mockReviews: Review[] = [
  {
    id: '1',
    fieldName: 'Futbol Arena',
    location: 'Kadıköy, İstanbul',
    rating: 4.5,
    comment: 'Harika bir saha! Zemin kalitesi çok iyi, duşlar temiz ve personel çok ilgili. Kesinlikle tekrar geleceğim.',
    userName: 'Mehmet Y.',
    date: '2024-03-20',
    likes: 12,
    replies: 3,
    images: ['/reviews/field1.jpg', '/reviews/field2.jpg']
  },
  {
    id: '2',
    fieldName: 'Spor Kompleksi',
    location: 'Beşiktaş, İstanbul',
    rating: 4.0,
    comment: 'İyi bir saha ama fiyatlar biraz yüksek. Aydınlatma sistemi çok iyi, gece maçları için ideal.',
    userName: 'Ayşe K.',
    date: '2024-03-19',
    likes: 8,
    replies: 1
  }
];

export default function ReviewsPage() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'likes'>('recent');

  const filteredReviews = selectedRating
    ? mockReviews.filter(review => Math.floor(review.rating) === selectedRating)
    : mockReviews;

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'likes':
        return b.likes - a.likes;
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

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
              Değerlendirmeler
            </h1>
            <p className="text-xl text-white/80">
              Halı sahalar hakkında yorumlar ve değerlendirmeler
            </p>
          </div>

          {/* Filtreler ve Sıralama */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 mb-8">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                    className={`p-2 rounded-xl transition-all ${
                      selectedRating === rating
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <FaStar className="text-xl" />
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy('recent')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    sortBy === 'recent'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  En Yeni
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy('rating')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    sortBy === 'rating'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  En Yüksek Puan
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy('likes')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    sortBy === 'likes'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  En Beğenilen
                </motion.button>
              </div>
            </div>
          </div>

          {/* Yorum Listesi */}
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                    <FaUser className="text-2xl text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white">{review.fieldName}</h3>
                        <div className="flex items-center text-white/60 text-sm gap-4">
                          <span className="flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {review.location}
                          </span>
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            {review.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span className="text-white font-semibold">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-white/80 mb-4">{review.comment}</p>
                    {review.images && (
                      <div className="flex gap-2 mb-4">
                        {review.images.map((image, index) => (
                          <div
                            key={index}
                            className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center"
                          >
                            <span className="text-white/60">Görsel {index + 1}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                        <FaThumbsUp />
                        <span>{review.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                        <FaComment />
                        <span>{review.replies}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
} 