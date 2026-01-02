export { AppointmentTable } from './components/AppointmentTable';
export { AppointmentForm } from './components/AppointmentForm';
export type {
  Appointment,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
  AppointmentFilters,
} from './appointments.types';
export {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} from './appointments.api';
