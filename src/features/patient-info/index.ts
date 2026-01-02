export { PatientInfoTable } from './components/PatientInfoTable';
export { PatientInfoForm } from './components/PatientInfoForm';
export { SectionEditor } from './components/SectionEditor';
export type {
  PatientInfo,
  PatientInfoSection,
  CreatePatientInfoPayload,
  UpdatePatientInfoPayload,
  PatientInfoFilters,
} from './patient-info.types';
export {
  useGetPatientInfoPagesQuery,
  useGetPatientInfoByIdQuery,
  useCreatePatientInfoMutation,
  useUpdatePatientInfoMutation,
  useDeletePatientInfoMutation,
} from './patient-info.api';
