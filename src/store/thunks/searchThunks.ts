import { createAsyncThunk } from '@reduxjs/toolkit';
import type { SearchParams } from '@/domain/entities/SearchParams';
import { VehicleService } from '@/domain/services/VehicleService';
import { VehicleRepository } from '@/infrastructure/repositories/VehicleRepository';
import { setVehicles, setLoading as setVehicleLoading, setError as setVehicleError } from '../slices/vehicleSlice';
import { setSearchParams, setLoading as setSearchLoading, setError as setSearchError } from '../slices/searchSlice';

// Instancia del servicio (en producción, usar inyección de dependencias)
const vehicleService = new VehicleService(new VehicleRepository());

export const searchVehicles = createAsyncThunk(
  'vehicles/search',
  async (params: SearchParams, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setSearchLoading(true));
      dispatch(setVehicleLoading(true));
      dispatch(setSearchParams(params));

      const vehicles = await vehicleService.searchVehicles(params);

      dispatch(setVehicles(vehicles));
      dispatch(setSearchLoading(false));
      dispatch(setVehicleLoading(false));

      return vehicles;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al buscar vehículos';
      dispatch(setSearchError(errorMessage));
      dispatch(setVehicleError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

