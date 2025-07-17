const getJsonObject = (obj: string | object) => {
  if (typeof obj === 'string') {
    try {
      return JSON.parse(obj);
    } catch (error) {
      console.error('Error parsing object:', error);
      return [];
    }
  }
  return obj;
};

export default getJsonObject;
