import { createAsyncThunk } from '@reduxjs/toolkit';
import { VehicleService } from '@/domain/services/VehicleService';
import { VehicleRepository } from '@/infrastructure/repositories/VehicleRepository';
import { selectVehicle, setError as setVehicleError } from '../slices/vehicleSlice';

// Instancia del servicio (en producción, usar inyección de dependencias)
const vehicleService = new VehicleService(new VehicleRepository());

export const fetchVehicleById = createAsyncThunk(
  'vehicles/fetchById',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const vehicle = await vehicleService.getVehicleById(id);

      if (!vehicle) {
        throw new Error('Vehículo no encontrado');
      }

      dispatch(selectVehicle(vehicle.id));
      return vehicle;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al obtener vehículo';
      dispatch(setVehicleError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

