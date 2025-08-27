// Simple test to verify QR code saving works
const testData = {
  cardId: Date.now().toString(),
  cardData: {
    name: "Test User",
    username: "testuser",
    title: "Developer",
    company: "Test Company",
    email: "test@example.com",
    phone: "+90 530 123 4567",
    website: "https://example.com",
    location: "Ankara, Türkiye",
    iban: "TR33 0006 1005 1978 6457 8413 26",
    projects: [
      {
        id: "1",
        name: "Test Project",
        description: "Test description",
        url: "https://example.com"
      }
    ]
  }
};

console.log('Test data to send:', JSON.stringify(testData, null, 2));

fetch('http://localhost:3000/api/qr-code', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Note: This will fail without authentication cookies
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => {
  console.log('Response:', data);
})
.catch(error => {
  console.error('Error:', error);
});