export const processFrame = async (frame: string) => {
  try {
    const response = await fetch('http://localhost:5000/api/process-frame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ frame }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error processing frame:', error);
    throw error;
  }
};

export const registerFace = async (image: string, name: string) => {
  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image, name }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error registering face:', error);
    throw error;
  }
};