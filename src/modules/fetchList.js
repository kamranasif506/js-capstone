

const fetchScores = async (baseUrl) => {
    const url = baseUrl;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  };
  
  export default fetchScores;