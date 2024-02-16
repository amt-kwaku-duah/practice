const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/lecturer/getall');
      const data = await response.json();
      console.log('Lecturers Data:', data);
      setLecturers(data.lecturers);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    }
  };

  fetchData();