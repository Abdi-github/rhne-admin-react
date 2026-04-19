import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { AuthLayout } from '@/layouts/AuthLayout/AuthLayout';
import { AdminLayout } from '@/layouts/AdminLayout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PermissionRoute } from './PermissionRoute';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

// Lazy-loaded pages
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const SitesListPage = lazy(() => import('@/features/sites/pages/SitesListPage'));
const SiteCreatePage = lazy(() => import('@/features/sites/pages/SiteCreatePage'));
const SiteEditPage = lazy(() => import('@/features/sites/pages/SiteEditPage'));
const ServicesListPage = lazy(() => import('@/features/services/pages/ServicesListPage'));
const ServiceCreatePage = lazy(() => import('@/features/services/pages/ServiceCreatePage'));
const ServiceEditPage = lazy(() => import('@/features/services/pages/ServiceEditPage'));
const ServiceDetailPage = lazy(() => import('@/features/services/pages/ServiceDetailPage'));
const DoctorsListPage = lazy(() => import('@/features/doctors/pages/DoctorsListPage'));
const DoctorCreatePage = lazy(() => import('@/features/doctors/pages/DoctorCreatePage'));
const DoctorEditPage = lazy(() => import('@/features/doctors/pages/DoctorEditPage'));
const EventsListPage = lazy(() => import('@/features/events/pages/EventsListPage'));
const EventCreatePage = lazy(() => import('@/features/events/pages/EventCreatePage'));
const EventEditPage = lazy(() => import('@/features/events/pages/EventEditPage'));
const JobsListPage = lazy(() => import('@/features/jobs/pages/JobsListPage'));
const JobCreatePage = lazy(() => import('@/features/jobs/pages/JobCreatePage'));
const JobEditPage = lazy(() => import('@/features/jobs/pages/JobEditPage'));
const NewbornsListPage = lazy(() => import('@/features/newborns/pages/NewbornsListPage'));
const NewbornCreatePage = lazy(() => import('@/features/newborns/pages/NewbornCreatePage'));
const NewbornEditPage = lazy(() => import('@/features/newborns/pages/NewbornEditPage'));
const PatientInfoListPage = lazy(() => import('@/features/patient-info/pages/PatientInfoListPage'));
const PatientInfoCreatePage = lazy(() => import('@/features/patient-info/pages/PatientInfoCreatePage'));
const PatientInfoEditPage = lazy(() => import('@/features/patient-info/pages/PatientInfoEditPage'));
const EmergencyHotlinesListPage = lazy(() => import('@/features/emergency-hotlines/pages/EmergencyHotlinesListPage'));
const EmergencyHotlineCreatePage = lazy(() => import('@/features/emergency-hotlines/pages/EmergencyHotlineCreatePage'));
const EmergencyHotlineEditPage = lazy(() => import('@/features/emergency-hotlines/pages/EmergencyHotlineEditPage'));
const AppointmentsListPage = lazy(() => import('@/features/appointments/pages/AppointmentsListPage'));
const AppointmentBookingsListPage = lazy(() => import('@/features/appointment-bookings/pages/AppointmentBookingsListPage'));
const AppointmentCreatePage = lazy(() => import('@/features/appointments/pages/AppointmentCreatePage'));
const AppointmentEditPage = lazy(() => import('@/features/appointments/pages/AppointmentEditPage'));
const UsersListPage = lazy(() => import('@/features/users/pages/UsersListPage'));
const UserDetailPage = lazy(() => import('@/features/users/pages/UserDetailPage'));
const RbacPage = lazy(() => import('@/features/rbac/pages/RbacPage'));
const NotFoundPage = lazy(() => import('@/shared/pages/NotFoundPage'));

function Loader() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
      }}
    >
      <CircularProgress />
    </Box>
  );
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  // Auth routes
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <LoginPage />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: '/forgot-password',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <ForgotPasswordPage />
          </LazyPage>
        ),
      },
    ],
  },
  {
    path: '/reset-password',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <ResetPasswordPage />
          </LazyPage>
        ),
      },
    ],
  },

  // Protected admin routes
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          // Dashboard
          {
            index: true,
            element: (
              <PermissionRoute roles={['admin', 'super_admin']}>
                <LazyPage>
                  <DashboardPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },

          // Settings (all authenticated users)
          {
            path: 'settings',
            element: (
              <LazyPage>
                <SettingsPage />
              </LazyPage>
            ),
          },

          // Sites
          {
            path: 'sites',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'site_manager']}>
                <LazyPage>
                  <SitesListPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'sites/create',
            element: (
              <PermissionRoute roles={['admin', 'super_admin']}>
                <LazyPage>
                  <SiteCreatePage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'sites/:id/edit',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'site_manager']}>
                <LazyPage>
                  <SiteEditPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },

          // Services
          {
            path: 'services',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <ServicesListPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'services/create',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <ServiceCreatePage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'services/:id',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <ServiceDetailPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'services/:id/edit',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <ServiceEditPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },

          // Doctors
          {
            path: 'doctors',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'site_manager']}>
                <LazyPage>
                  <DoctorsListPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'doctors/create',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'site_manager']}>
                <LazyPage>
                  <DoctorCreatePage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'doctors/:id/edit',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'site_manager']}>
                <LazyPage>
                  <DoctorEditPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },

          // Events
          {
            path: 'events',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <EventsListPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'events/create',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <EventCreatePage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'events/:id/edit',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <EventEditPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },

          // Jobs
          {
            path: 'jobs',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'hr_manager']}>
                <LazyPage>
                  <JobsListPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'jobs/create',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'hr_manager']}>
                <LazyPage>
                  <JobCreatePage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'jobs/:id/edit',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'hr_manager']}>
                <LazyPage>
                  <JobEditPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },

          // Newborns
          {
            path: 'newborns',
            element: (
              <PermissionRoute roles={['admin', 'super_admin']}>
                <LazyPage>
                  <NewbornsListPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'newborns/create',
            element: (
              <PermissionRoute roles={['admin', 'super_admin']}>
                <LazyPage>
                  <NewbornCreatePage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'newborns/:id/edit',
            element: (
              <PermissionRoute roles={['admin', 'super_admin']}>
                <LazyPage>
                  <NewbornEditPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },

          // Patient Info
          {
            path: 'patient-info',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <PatientInfoListPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'patient-info/create',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <PatientInfoCreatePage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'patient-info/:id/edit',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <PatientInfoEditPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },

          // Emergency Hotlines
          {
            path: 'emergency-hotlines',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <EmergencyHotlinesListPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'emergency-hotlines/create',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <EmergencyHotlineCreatePage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'emergency-hotlines/:id/edit',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <EmergencyHotlineEditPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },

          // Appointments
          {
            path: 'appointments',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <AppointmentsListPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'appointments/create',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <AppointmentCreatePage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'appointments/:id/edit',
            element: (
              <PermissionRoute roles={['admin', 'super_admin', 'content_editor']}>
                <LazyPage>
                  <AppointmentEditPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },

          // Appointment Bookings
          {
            path: 'appointment-bookings',
            element: (
              <PermissionRoute roles={['admin', 'super_admin']}>
                <LazyPage>
                  <AppointmentBookingsListPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },

          // Users
          {
            path: 'users',
            element: (
              <PermissionRoute roles={['admin', 'super_admin']}>
                <LazyPage>
                  <UsersListPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },
          {
            path: 'users/:id',
            element: (
              <PermissionRoute roles={['admin', 'super_admin']}>
                <LazyPage>
                  <UserDetailPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },

          // RBAC
          {
            path: 'rbac',
            element: (
              <PermissionRoute roles={['super_admin']}>
                <LazyPage>
                  <RbacPage />
                </LazyPage>
              </PermissionRoute>
            ),
          },

          // 404 catch-all
          {
            path: '*',
            element: (
              <LazyPage>
                <NotFoundPage />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },
]);
