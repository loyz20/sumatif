const masterNilaiService = require('../src/modules/masterNilai/service');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function testService() {
  try {
    const result = await masterNilaiService.list('some-id');
    console.log('Service Success:', result);
  } catch (err) {
    console.error('Service Error:', err.message);
  }
}

testService();
