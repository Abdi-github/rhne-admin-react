import { useState } from 'react';
import { Box, Tab, Tabs, Button, Card, CardContent } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@/shared/hooks/useNotification';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { ServiceContactsTable } from './ServiceContactsTable';
import { ServiceContactForm, type ContactFormValues } from './ServiceContactForm';
import { ServiceLinksTable } from './ServiceLinksTable';
import { ServiceLinkForm, type LinkFormValues } from './ServiceLinkForm';
import {
  useGetServiceContactsQuery,
  useCreateServiceContactMutation,
  useUpdateServiceContactMutation,
  useDeleteServiceContactMutation,
  useGetServiceLinksQuery,
  useCreateServiceLinkMutation,
  useUpdateServiceLinkMutation,
  useDeleteServiceLinkMutation,
} from '../services.api';
import type { ServiceContact, ServiceLink } from '../services.types';

interface ServiceDetailViewProps {
  serviceId: string;
}

export function ServiceDetailView({ serviceId }: ServiceDetailViewProps) {
  const { t } = useTranslation(['services', 'common']);
  const notification = useNotification();
  const [activeTab, setActiveTab] = useState('contacts');

  // ── Contact state ──
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [editContact, setEditContact] = useState<ServiceContact | null>(null);
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);

  // ── Link state ──
  const [linkFormOpen, setLinkFormOpen] = useState(false);
  const [editLink, setEditLink] = useState<ServiceLink | null>(null);
  const [deleteLinkId, setDeleteLinkId] = useState<string | null>(null);

  // ── Contact queries/mutations ──
  const { data: contactsData, isLoading: contactsLoading } = useGetServiceContactsQuery(serviceId);
  const [createContact, { isLoading: isCreatingContact }] = useCreateServiceContactMutation();
  const [updateContact, { isLoading: isUpdatingContact }] = useUpdateServiceContactMutation();
  const [deleteContact, { isLoading: isDeletingContact }] = useDeleteServiceContactMutation();

  // ── Link queries/mutations ──
  const { data: linksData, isLoading: linksLoading } = useGetServiceLinksQuery(serviceId);
  const [createLink, { isLoading: isCreatingLink }] = useCreateServiceLinkMutation();
  const [updateLink, { isLoading: isUpdatingLink }] = useUpdateServiceLinkMutation();
  const [deleteLink, { isLoading: isDeletingLink }] = useDeleteServiceLinkMutation();

  const contacts = contactsData?.data ?? [];
  const links = linksData?.data ?? [];

  // ── Contact handlers ──
  const handleOpenContactForm = (contact?: ServiceContact) => {
    setEditContact(contact ?? null);
    setContactFormOpen(true);
  };

  const handleCloseContactForm = () => {
    setContactFormOpen(false);
    setEditContact(null);
  };

  const handleContactSubmit = async (values: ContactFormValues) => {
    try {
      if (editContact) {
        await updateContact({
          id: editContact._id,
          serviceId,
          body: values,
        }).unwrap();
        notification.success(t('services:contacts.updated_success'));
      } else {
        await createContact({ serviceId, body: values }).unwrap();
        notification.success(t('services:contacts.created_success'));
      }
      handleCloseContactForm();
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  const handleDeleteContact = async () => {
    if (!deleteContactId) return;
    try {
      await deleteContact({ id: deleteContactId, serviceId }).unwrap();
      notification.success(t('services:contacts.deleted_success'));
      setDeleteContactId(null);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  // ── Link handlers ──
  const handleOpenLinkForm = (link?: ServiceLink) => {
    setEditLink(link ?? null);
    setLinkFormOpen(true);
  };

  const handleCloseLinkForm = () => {
    setLinkFormOpen(false);
    setEditLink(null);
  };

  const handleLinkSubmit = async (values: LinkFormValues) => {
    try {
      if (editLink) {
        await updateLink({
          id: editLink._id,
          serviceId,
          body: values,
        }).unwrap();
        notification.success(t('services:links.updated_success'));
      } else {
        await createLink({ serviceId, body: values }).unwrap();
        notification.success(t('services:links.created_success'));
      }
      handleCloseLinkForm();
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  const handleDeleteLink = async () => {
    if (!deleteLinkId) return;
    try {
      await deleteLink({ id: deleteLinkId, serviceId }).unwrap();
      notification.success(t('services:links.deleted_success'));
      setDeleteLinkId(null);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={activeTab} onChange={(_, v: string) => setActiveTab(v)}>
            <Tab label={`${t('services:tabs.contacts')} (${contacts.length})`} value="contacts" />
            <Tab label={`${t('services:tabs.links')} (${links.length})`} value="links" />
          </Tabs>
        </Box>

        {activeTab === 'contacts' && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                onClick={() => handleOpenContactForm()}
              >
                {t('services:contacts.add')}
              </Button>
            </Box>
            <ServiceContactsTable
              contacts={contacts}
              isLoading={contactsLoading}
              onEdit={(contact) => handleOpenContactForm(contact)}
              onDelete={(id) => setDeleteContactId(id)}
            />
          </Box>
        )}

        {activeTab === 'links' && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                onClick={() => handleOpenLinkForm()}
              >
                {t('services:links.add')}
              </Button>
            </Box>
            <ServiceLinksTable
              links={links}
              isLoading={linksLoading}
              onEdit={(link) => handleOpenLinkForm(link)}
              onDelete={(id) => setDeleteLinkId(id)}
            />
          </Box>
        )}
      </CardContent>

      {/* Contact Form Dialog */}
      <ServiceContactForm
        open={contactFormOpen}
        onClose={handleCloseContactForm}
        onSubmit={handleContactSubmit}
        isLoading={isCreatingContact || isUpdatingContact}
        editContact={editContact}
      />

      {/* Link Form Dialog */}
      <ServiceLinkForm
        open={linkFormOpen}
        onClose={handleCloseLinkForm}
        onSubmit={handleLinkSubmit}
        isLoading={isCreatingLink || isUpdatingLink}
        editLink={editLink}
      />

      {/* Delete Contact Confirm */}
      <ConfirmDialog
        open={!!deleteContactId}
        title={t('common:confirm_delete_title')}
        message={t('services:contacts.confirm_delete')}
        onConfirm={handleDeleteContact}
        onCancel={() => setDeleteContactId(null)}
        isLoading={isDeletingContact}
      />

      {/* Delete Link Confirm */}
      <ConfirmDialog
        open={!!deleteLinkId}
        title={t('common:confirm_delete_title')}
        message={t('services:links.confirm_delete')}
        onConfirm={handleDeleteLink}
        onCancel={() => setDeleteLinkId(null)}
        isLoading={isDeletingLink}
      />
    </Card>
  );
}
