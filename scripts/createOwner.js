const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User').default || require('../models/User');
const Field = require('../models/Field').default || require('../models/Field');

require('dotenv').config({ path: './hali_saha.env' }); // .env dosyanıza göre yolu ayarlayın

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const password = await bcrypt.hash('admin123', 10);
  const field = await Field.create({ name: 'Test Saha', price: 500, size: '30x50', address: 'Test Mah.' });
  await User.create({ email: 'admin@deneme.com', password, role: 'owner', fieldId: field._id });
  console.log('Test admin ve saha oluşturuldu');
  process.exit();
})();
