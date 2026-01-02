export {
  doctorsApi,
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} from './doctors.api';
export type {
  Doctor,
  DoctorFilters,
  CreateDoctorPayload,
  UpdateDoctorPayload,
} from './doctors.types';
export { DoctorTable } from './components/DoctorTable';
export { DoctorForm } from './components/DoctorForm';
