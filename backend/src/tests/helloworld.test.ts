import axios from 'axios';

describe('Hello World API', () => {
  const BACKEND_URL = 'http://localhost:3000/api/helloworld';

  it('should return hello world message', async () => {
    const response = await axios.get(BACKEND_URL);
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message', 'Hello World!');
    expect(response.data).toHaveProperty('timestamp');
    expect(response.data).toHaveProperty('environment');
  });
}); 