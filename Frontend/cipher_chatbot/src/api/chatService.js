import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Point to local Flask server
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendMessage = async (message, apiKey) => {
  try {
    const response = await api.post('/chat', {
      message,
      apiKey,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const streamChat = async (message, file, username, onChunk, onDone, onError) => {
  try {
    let fileData = null;
    if (file) {
      // Simple helper to convert file to base64
      const toBase64 = f => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
      fileData = {
        name: file.name,
        type: file.type,
        data: await toBase64(file)
      };
    }

    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        file: fileData,
        username
      }),
    });


    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.done) {
              // Some done events also carry a chunk (e.g. account_locked)
              if (data.chunk) {
                onChunk(data.chunk);
              }
              onDone(data);
            } else if (data.chunk) {
              onChunk(data.chunk);
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Stream error:', error);
    onError(error);
  }
};
