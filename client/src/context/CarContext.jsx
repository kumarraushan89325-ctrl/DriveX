import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const CarContext = createContext(null);

const defaultFilters = {
  search: '',
  brand: '',
  fuelType: '',
  transmission: '',
  seats: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  available: '',
  location: '',
  pickupDate: '',
  returnDate: '',
  sort: 'newest',
};

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);

  const fetchCars = async (override = {}) => {
    setLoading(true);
    try {
      const params = { ...filters, ...override };
      Object.keys(params).forEach((key) => {
        if (params[key] === '' || params[key] == null) delete params[key];
      });
      const { data } = await api.get('/cars', { params });
      setCars(data.cars || []);
      return data.cars || [];
    } finally {
      setLoading(false);
    }
  };

  const getCar = async (id) => {
    const { data } = await api.get(`/cars/${id}`);
    return data.car;
  };

  return (
    <CarContext.Provider
      value={{ cars, loading, filters, setFilters, fetchCars, getCar, defaultFilters }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCars = () => useContext(CarContext);
