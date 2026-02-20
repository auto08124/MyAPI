require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// เชื่อมต่อ Supabase ผ่าน Environment Variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// API ดึงข้อมูลสินค้าทั้งหมด
app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// API เพิ่มสินค้าใหม่
app.post('/api/products', async (req, res) => {
  const { name, price, description } = req.body;
  const { data, error } = await supabase
    .from('products')
    .insert([{ name, price, description }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

module.exports = app; // สำหรับ Vercel

// สำหรับรันทดสอบในเครื่องตัวเอง
if (process.env.NODE_ENV !== 'production') {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
// เพิ่มตรงนี้เพื่อรับแขกที่หน้าแรก
app.get('/', (req, res) => {
  res.send('ยินดีต้อนรับสู่ Product API ของฉัน! กรุณาไปที่ /api/products เพื่อดูข้อมูล');
});
