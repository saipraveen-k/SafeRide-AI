// Simple test script to verify AI endpoints are working
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testAIEndpoints() {
  const API_URL = 'http://localhost:5000/api';
  
  try {
    console.log('🧪 Testing AI endpoints...');
    
    // Test 1: Health check
    console.log('\n1. Testing health check...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    
    // Test 2: AI test endpoint (will fail without auth, but should show route exists)
    console.log('\n2. Testing AI test endpoint...');
    try {
      const testResponse = await axios.post(`${API_URL}/ai/test`);
      console.log('✅ AI test:', testResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ AI test endpoint exists (auth required)');
      } else {
        console.log('❌ AI test endpoint error:', error.message);
      }
    }
    
    // Test 3: Check if uploads directory exists
    console.log('\n3. Checking uploads directory...');
    if (fs.existsSync('./uploads')) {
      console.log('✅ Uploads directory exists');
    } else {
      console.log('❌ Uploads directory missing');
    }
    
    console.log('\n🎉 AI endpoint tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testAIEndpoints();
