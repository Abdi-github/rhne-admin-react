export interface DashboardStats {
  total: {
    sites: number;
    services: number;
    doctors: number;
    events: number;
    jobs: number;
    newborns: number;
    patient_info: number;
    users: number;
  };
  active: {
    sites: number;
    services: number;
    doctors: number;
  };
}
