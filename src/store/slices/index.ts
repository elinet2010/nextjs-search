// Exportar todas las acciones de los slices
// Nota: setError y setLoading están en múltiples slices, usar nombres específicos
export {
  setSearchParams,
  setLoading as setSearchLoading,
  setError as setSearchError,
  clearSearch,
} from './searchSlice';

export {
  setVehicles,
  selectVehicle,
  setLoading as setVehicleLoading,
  setError as setVehicleError,
  clearVehicles,
} from './vehicleSlice';

export { setBooking, confirmBooking, clearBooking } from './bookingSlice';

