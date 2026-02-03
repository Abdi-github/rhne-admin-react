import { http, HttpResponse } from 'msw';
import { mockServices, mockServiceContacts, mockServiceLinks } from '../data/services';
import { mockSites } from '../data/sites';
import { mockDoctors } from '../data/doctors';
import { mockEvents } from '../data/events';
import { mockJobs } from '../data/jobs';
import { mockNewborns } from '../data/newborns';
import { mockPatientInfoPages } from '../data/patient-info';
import { mockUsers } from '../data/users';
import { mockRoles, mockPermissions } from '../data/rbac';

const API_URL = 'http://localhost:5000/api/v1';

export const handlers = [
  // ── Dashboard ──
  http.get(`${API_URL}/admin/dashboard/stats`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Dashboard stats',
      data: {
        total: { sites: 7, services: 93, doctors: 138, events: 7, jobs: 9, newborns: 800, patient_info: 18, users: 10 },
        active: { sites: 7, services: 90, doctors: 130 },
      },
    });
  }),

  // ── Sites ──
  http.get(`${API_URL}/admin/sites`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const isActive = url.searchParams.get('is_active');

    let filtered = [...mockSites];
    if (search) {
      filtered = filtered.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (isActive === 'true') {
      filtered = filtered.filter((s) => s.is_active);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      message: 'Sites retrieved',
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }),

  http.get(`${API_URL}/admin/sites/:id`, ({ params }) => {
    const site = mockSites.find((s) => s._id === params.id);
    if (!site) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Site retrieved', data: site });
  }),

  http.post(`${API_URL}/admin/sites`, async ({ request }) => {
    const body = await request.json();
    const newSite = { _id: 'new-site-id', slug: 'new-site', ...body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, message: 'Site created', data: newSite }, { status: 201 });
  }),

  http.put(`${API_URL}/admin/sites/:id`, async ({ params, request }) => {
    const body = await request.json();
    const site = mockSites.find((s) => s._id === params.id);
    if (!site) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Site updated', data: { ...site, ...body } });
  }),

  http.delete(`${API_URL}/admin/sites/:id`, () => {
    return HttpResponse.json({ success: true, message: 'Site deleted', data: null });
  }),

  // ── Services ──
  http.get(`${API_URL}/admin/services`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const isActive = url.searchParams.get('is_active');

    let filtered = [...mockServices];
    if (search) {
      filtered = filtered.filter((s) => s.name.fr.toLowerCase().includes(search.toLowerCase()));
    }
    if (isActive === 'true') {
      filtered = filtered.filter((s) => s.is_active);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      message: 'Services retrieved',
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }),

  http.get(`${API_URL}/admin/services/:id`, ({ params }) => {
    const service = mockServices.find((s) => s._id === params.id);
    if (!service) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Service retrieved', data: service });
  }),

  http.post(`${API_URL}/admin/services`, async ({ request }) => {
    const body = await request.json();
    const newService = {
      _id: 'new-service-id',
      slug: 'new-service',
      ...body,
      image_url: body.image_url || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, message: 'Service created', data: newService }, { status: 201 });
  }),

  http.put(`${API_URL}/admin/services/:id`, async ({ params, request }) => {
    const body = await request.json();
    const service = mockServices.find((s) => s._id === params.id);
    if (!service) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Service updated', data: { ...service, ...body } });
  }),

  http.delete(`${API_URL}/admin/services/:id`, () => {
    return HttpResponse.json({ success: true, message: 'Service deleted', data: null });
  }),

  // ── Service Contacts ──
  http.get(`${API_URL}/admin/services/:serviceId/contacts`, ({ params }) => {
    const contacts = mockServiceContacts.filter((c) => c.service_id === params.serviceId);
    return HttpResponse.json({ success: true, message: 'Contacts retrieved', data: contacts });
  }),

  http.post(`${API_URL}/admin/services/:serviceId/contacts`, async ({ params, request }) => {
    const body = await request.json();
    const newContact = {
      _id: 'new-contact-id',
      service_id: params.serviceId as string,
      site_id: null,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, message: 'Contact created', data: newContact }, { status: 201 });
  }),

  http.put(`${API_URL}/admin/service-contacts/:id`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, message: 'Contact updated', data: { _id: 'contact-1', ...body } });
  }),

  http.delete(`${API_URL}/admin/service-contacts/:id`, () => {
    return HttpResponse.json({ success: true, message: 'Contact deleted', data: null });
  }),

  // ── Service Links ──
  http.get(`${API_URL}/admin/services/:serviceId/links`, ({ params }) => {
    const links = mockServiceLinks.filter((l) => l.service_id === params.serviceId);
    return HttpResponse.json({ success: true, message: 'Links retrieved', data: links });
  }),

  http.post(`${API_URL}/admin/services/:serviceId/links`, async ({ params, request }) => {
    const body = await request.json();
    const newLink = {
      _id: 'new-link-id',
      service_id: params.serviceId as string,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, message: 'Link created', data: newLink }, { status: 201 });
  }),

  http.put(`${API_URL}/admin/service-links/:id`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, message: 'Link updated', data: { _id: 'link-1', ...body } });
  }),

  http.delete(`${API_URL}/admin/service-links/:id`, () => {
    return HttpResponse.json({ success: true, message: 'Link deleted', data: null });
  }),

  // ── Uploads ──
  http.post(`${API_URL}/admin/uploads/images/:resource`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Image uploaded',
      data: { url: 'https://res.cloudinary.com/test/image.jpg', public_id: 'test/image', width: 800, height: 600 },
    });
  }),

  http.delete(`${API_URL}/admin/uploads/images`, () => {
    return HttpResponse.json({ success: true, message: 'Image deleted', data: null });
  }),

  // ── Auth ──
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === 'superadmin@rhne-clone.ch' && body.password === 'SuperAdmin123!') {
      return HttpResponse.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            _id: 'user-super-admin',
            email: 'superadmin@rhne-clone.ch',
            first_name: 'Super',
            last_name: 'Admin',
            preferred_language: 'fr',
            is_active: true,
            is_verified: true,
            roles: ['super_admin'],
            permissions: ['services.read', 'services.create', 'services.update', 'services.delete', 'sites.read', 'sites.create', 'sites.update', 'sites.delete'],
            site_id: null,
            avatar_url: null,
          },
          tokens: { access_token: 'test-access-token', refresh_token: 'test-refresh-token' },
        },
      });
    }
    if (body.email === 'editor@rhne-clone.ch' && body.password === 'Editor123!') {
      return HttpResponse.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            _id: 'user-editor',
            email: 'editor@rhne-clone.ch',
            first_name: 'Content',
            last_name: 'Editor',
            preferred_language: 'fr',
            is_active: true,
            is_verified: true,
            roles: ['content_editor'],
            permissions: ['services.read', 'services.create', 'services.update', 'services.delete'],
            site_id: null,
            avatar_url: null,
          },
          tokens: { access_token: 'test-editor-token', refresh_token: 'test-editor-refresh' },
        },
      });
    }
    if (body.email === 'hr@rhne-clone.ch' && body.password === 'HrManager123!') {
      return HttpResponse.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            _id: 'user-hr',
            email: 'hr@rhne-clone.ch',
            first_name: 'HR',
            last_name: 'Manager',
            preferred_language: 'fr',
            is_active: true,
            is_verified: true,
            roles: ['hr_manager'],
            permissions: ['jobs.read', 'jobs.create', 'jobs.update', 'jobs.delete'],
            site_id: null,
            avatar_url: null,
          },
          tokens: { access_token: 'test-hr-token', refresh_token: 'test-hr-refresh' },
        },
      });
    }
    return HttpResponse.json(
      { success: false, message: 'Invalid credentials', error: { code: 'INVALID_CREDENTIALS', details: [] } },
      { status: 401 },
    );
  }),

  // ── Doctors ──
  http.get(`${API_URL}/admin/doctors`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const isActive = url.searchParams.get('is_active');

    let filtered = [...mockDoctors];
    if (search) {
      filtered = filtered.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (isActive === 'true') {
      filtered = filtered.filter((d) => d.is_active);
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      message: 'Doctors retrieved',
      data: paginated,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }),

  http.get(`${API_URL}/admin/doctors/:id`, ({ params }) => {
    const doctor = mockDoctors.find((d) => d._id === params.id);
    if (!doctor) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Doctor retrieved', data: doctor });
  }),

  http.post(`${API_URL}/admin/doctors`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newDoctor = {
      _id: 'doctor-new',
      name: body.name,
      title: body.title ?? null,
      service_id: body.service_id,
      service_name: 'Médecine interne',
      image_url: body.image_url || '',
      is_active: body.is_active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, message: 'Doctor created', data: newDoctor }, { status: 201 });
  }),

  http.put(`${API_URL}/admin/doctors/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const doctor = mockDoctors.find((d) => d._id === params.id);
    if (!doctor) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    const updated = { ...doctor, ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, message: 'Doctor updated', data: updated });
  }),

  http.delete(`${API_URL}/admin/doctors/:id`, ({ params }) => {
    const doctor = mockDoctors.find((d) => d._id === params.id);
    if (!doctor) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Doctor deleted', data: { ...doctor, is_active: false } });
  }),

  // ── Events ──
  http.get(`${API_URL}/admin/events`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const isActive = url.searchParams.get('is_active');

    let filtered = [...mockEvents];
    if (search) {
      filtered = filtered.filter((e) => e.title.fr.toLowerCase().includes(search.toLowerCase()));
    }
    if (isActive === 'true') {
      filtered = filtered.filter((e) => e.is_active);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      message: 'Events retrieved',
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }),

  http.get(`${API_URL}/admin/events/:id`, ({ params }) => {
    const event = mockEvents.find((e) => e._id === params.id);
    if (!event) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Event retrieved', data: event });
  }),

  http.post(`${API_URL}/admin/events`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const newEvent = {
      _id: 'event-new',
      slug: 'new-event',
      detail_url: '',
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, message: 'Event created', data: newEvent }, { status: 201 });
  }),

  http.put(`${API_URL}/admin/events/:id`, async ({ params, request }) => {
    const event = mockEvents.find((e) => e._id === params.id);
    if (!event) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ success: true, message: 'Event updated', data: { ...event, ...body } });
  }),

  http.delete(`${API_URL}/admin/events/:id`, ({ params }) => {
    const event = mockEvents.find((e) => e._id === params.id);
    if (!event) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Event deleted', data: { ...event, is_active: false } });
  }),

  // ── Jobs ──
  http.get(`${API_URL}/admin/jobs`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const isActive = url.searchParams.get('is_active');

    let filtered = [...mockJobs];
    if (search) {
      filtered = filtered.filter((j) => j.title.fr.toLowerCase().includes(search.toLowerCase()));
    }
    if (isActive === 'true') {
      filtered = filtered.filter((j) => j.is_active);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      message: 'Jobs retrieved',
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }),

  http.get(`${API_URL}/admin/jobs/:id`, ({ params }) => {
    const job = mockJobs.find((j) => j._id === params.id);
    if (!job) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Job retrieved', data: job });
  }),

  http.post(`${API_URL}/admin/jobs`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const newJob = {
      _id: 'job-new',
      job_id: '',
      url: '',
      category: '',
      percentage: '',
      requirements: [],
      site: '',
      department: '',
      published_date: new Date().toISOString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, message: 'Job created', data: newJob }, { status: 201 });
  }),

  http.put(`${API_URL}/admin/jobs/:id`, async ({ params, request }) => {
    const job = mockJobs.find((j) => j._id === params.id);
    if (!job) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ success: true, message: 'Job updated', data: { ...job, ...body } });
  }),

  http.delete(`${API_URL}/admin/jobs/:id`, ({ params }) => {
    const job = mockJobs.find((j) => j._id === params.id);
    if (!job) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Job deleted', data: { ...job, is_active: false } });
  }),

  // ── Newborns ──
  http.get(`${API_URL}/admin/newborns`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';

    let filtered = [...mockNewborns];
    if (search) {
      filtered = filtered.filter((n) => n.name.toLowerCase().includes(search.toLowerCase()));
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      message: 'Newborns retrieved',
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }),

  http.get(`${API_URL}/admin/newborns/:id`, ({ params }) => {
    const newborn = mockNewborns.find((n) => n._id === params.id);
    if (!newborn) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Newborn retrieved', data: newborn });
  }),

  http.post(`${API_URL}/admin/newborns`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const newNewborn = {
      _id: 'newborn-new',
      image_url: '',
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, message: 'Newborn created', data: newNewborn }, { status: 201 });
  }),

  http.put(`${API_URL}/admin/newborns/:id`, async ({ params, request }) => {
    const newborn = mockNewborns.find((n) => n._id === params.id);
    if (!newborn) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ success: true, message: 'Newborn updated', data: { ...newborn, ...body } });
  }),

  http.delete(`${API_URL}/admin/newborns/:id`, ({ params }) => {
    const newborn = mockNewborns.find((n) => n._id === params.id);
    if (!newborn) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Newborn deleted', data: null });
  }),

  // ── Patient Info ──
  http.get(`${API_URL}/admin/patient-info`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const section = url.searchParams.get('section') || '';

    let filtered = [...mockPatientInfoPages];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.fr.toLowerCase().includes(q) ||
          p.title.en.toLowerCase().includes(q) ||
          p.section.toLowerCase().includes(q)
      );
    }

    if (section) {
      filtered = filtered.filter((p) => p.section === section);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      message: 'Patient info pages retrieved',
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }),

  http.get(`${API_URL}/admin/patient-info/:id`, ({ params }) => {
    const info = mockPatientInfoPages.find((p) => p._id === params.id);
    if (!info) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Patient info retrieved', data: info });
  }),

  http.post(`${API_URL}/admin/patient-info`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const newInfo = {
      _id: 'pi-new',
      slug: 'new-page',
      url: '',
      section: '',
      sections: [],
      content: null,
      image_url: '',
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, message: 'Patient info created', data: newInfo }, { status: 201 });
  }),

  http.put(`${API_URL}/admin/patient-info/:id`, async ({ params, request }) => {
    const info = mockPatientInfoPages.find((p) => p._id === params.id);
    if (!info) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ success: true, message: 'Patient info updated', data: { ...info, ...body } });
  }),

  http.delete(`${API_URL}/admin/patient-info/:id`, ({ params }) => {
    const info = mockPatientInfoPages.find((p) => p._id === params.id);
    if (!info) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Patient info deleted', data: null });
  }),

  // ── Users ──
  http.get(`${API_URL}/admin/users`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const isActive = url.searchParams.get('is_active');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let filtered = [...mockUsers];
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.first_name.toLowerCase().includes(search) ||
          u.last_name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search),
      );
    }
    if (isActive === 'true') filtered = filtered.filter((u) => u.is_active);
    if (isActive === 'false') filtered = filtered.filter((u) => !u.is_active);

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      message: 'Users retrieved',
      data: paginated,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }),

  http.get(`${API_URL}/admin/users/:id`, ({ params }) => {
    const user = mockUsers.find((u) => u._id === params.id);
    if (!user) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'User retrieved', data: user });
  }),

  http.post(`${API_URL}/admin/users`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const newUser = {
      _id: `user-${Date.now()}`,
      ...body,
      roles: [],
      site_id: null,
      avatar_url: null,
      is_active: true,
      is_verified: false,
      last_login_at: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, message: 'User created', data: newUser }, { status: 201 });
  }),

  http.put(`${API_URL}/admin/users/:id`, async ({ params, request }) => {
    const user = mockUsers.find((u) => u._id === params.id);
    if (!user) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ success: true, message: 'User updated', data: { ...user, ...body } });
  }),

  http.delete(`${API_URL}/admin/users/:id`, ({ params }) => {
    const user = mockUsers.find((u) => u._id === params.id);
    if (!user) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'User deleted', data: null });
  }),

  http.put(`${API_URL}/admin/users/:id/roles`, async ({ params, request }) => {
    const user = mockUsers.find((u) => u._id === params.id);
    if (!user) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    const body = await request.json() as { role_ids: string[] };
    const assignedRoles = mockRoles
      .filter((r) => body.role_ids.includes(r._id))
      .map((r) => ({ _id: r._id, name: r.name, display_name: r.display_name }));
    return HttpResponse.json({ success: true, message: 'Roles assigned', data: { ...user, roles: assignedRoles } });
  }),

  // ── Roles ──
  http.get(`${API_URL}/admin/roles`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let filtered = [...mockRoles];
    if (search) {
      filtered = filtered.filter(
        (r) => r.name.toLowerCase().includes(search) || r.display_name.fr.toLowerCase().includes(search),
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      message: 'Roles retrieved',
      data: paginated,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }),

  http.get(`${API_URL}/admin/roles/:id`, ({ params }) => {
    const role = mockRoles.find((r) => r._id === params.id);
    if (!role) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    const permissions = mockPermissions.slice(0, 4);
    return HttpResponse.json({ success: true, message: 'Role retrieved', data: { ...role, permissions } });
  }),

  http.post(`${API_URL}/admin/roles`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const newRole = {
      _id: `role-${Date.now()}`,
      ...body,
      is_system: false,
      is_active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, message: 'Role created', data: newRole }, { status: 201 });
  }),

  http.put(`${API_URL}/admin/roles/:id`, async ({ params, request }) => {
    const role = mockRoles.find((r) => r._id === params.id);
    if (!role) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ success: true, message: 'Role updated', data: { ...role, ...body } });
  }),

  http.delete(`${API_URL}/admin/roles/:id`, ({ params }) => {
    const role = mockRoles.find((r) => r._id === params.id);
    if (!role) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, message: 'Role deleted', data: null });
  }),

  // ── Permissions ──
  http.get(`${API_URL}/admin/permissions`, ({ request }) => {
    const url = new URL(request.url);
    const resource = url.searchParams.get('resource') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '100');

    let filtered = [...mockPermissions];
    if (resource) {
      filtered = filtered.filter((p) => p.resource === resource);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      message: 'Permissions retrieved',
      data: paginated,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }),

  http.put(`${API_URL}/admin/roles/:id/permissions`, async ({ params, request }) => {
    const role = mockRoles.find((r) => r._id === params.id);
    if (!role) {
      return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }
    const body = await request.json() as { permission_ids: string[] };
    const permissions = mockPermissions.filter((p) => body.permission_ids.includes(p._id));
    return HttpResponse.json({ success: true, message: 'Permissions assigned', data: { ...role, permissions } });
  }),

  // ── Profile ──
  http.get(`${API_URL}/admin/profile`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Profile retrieved',
      data: {
        _id: 'user-super-admin',
        email: 'superadmin@rhne-clone.ch',
        first_name: 'Super',
        last_name: 'Admin',
        phone: '+41 32 000 00 00',
        preferred_language: 'fr',
        is_active: true,
        is_verified: true,
        avatar_url: null,
      },
    });
  }),
];
