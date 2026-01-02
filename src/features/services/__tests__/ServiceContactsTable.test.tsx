import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { ServiceContactsTable } from '../components/ServiceContactsTable';
import { mockServiceContacts } from '@/test/data/services';

describe('ServiceContactsTable', () => {
  const defaultProps = {
    contacts: mockServiceContacts,
    isLoading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders all contacts', () => {
    renderWithProviders(<ServiceContactsTable {...defaultProps} />);

    expect(screen.getByText('Hôpital Pourtalès')).toBeInTheDocument();
    expect(screen.getByText('La Chaux-de-Fonds')).toBeInTheDocument();
    expect(screen.getByText('cardio@rhne.ch')).toBeInTheDocument();
    expect(screen.getByText('cardio.lcf@rhne.ch')).toBeInTheDocument();
  });

  it('displays phone numbers', () => {
    renderWithProviders(<ServiceContactsTable {...defaultProps} />);

    expect(screen.getByText('+41 32 713 30 50')).toBeInTheDocument();
    expect(screen.getByText('+41 32 967 21 50')).toBeInTheDocument();
  });

  it('displays hours in current language', () => {
    renderWithProviders(<ServiceContactsTable {...defaultProps} />);

    expect(screen.getByText('Lun-Ven 08:00-17:00')).toBeInTheDocument();
  });

  it('shows dash for missing hours', () => {
    renderWithProviders(<ServiceContactsTable {...defaultProps} />);

    // Contact 2 has null hours — displayed as em-dash
    const cells = screen.getAllByText('—');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('shows empty state when no contacts', () => {
    renderWithProviders(
      <ServiceContactsTable {...defaultProps} contacts={[]} />,
    );

    expect(screen.getByText('Aucun contact trouvé')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', async () => {
    const onEdit = vi.fn();
    const { user } = renderWithProviders(
      <ServiceContactsTable {...defaultProps} onEdit={onEdit} />,
    );

    // Each row has 2 icon buttons (edit, delete)
    const rows = screen.getAllByRole('row');
    // First data row (skip header)
    const firstDataRow = rows[1];
    const buttons = within(firstDataRow).getAllByRole('button');
    await user.click(buttons[0]); // edit is first

    expect(onEdit).toHaveBeenCalledWith(mockServiceContacts[0]);
  });

  it('calls onDelete when delete button clicked', async () => {
    const onDelete = vi.fn();
    const { user } = renderWithProviders(
      <ServiceContactsTable {...defaultProps} onDelete={onDelete} />,
    );

    const rows = screen.getAllByRole('row');
    const firstDataRow = rows[1];
    const buttons = within(firstDataRow).getAllByRole('button');
    await user.click(buttons[1]); // delete is second

    expect(onDelete).toHaveBeenCalledWith('contact-1');
  });

  it('renders table headers', () => {
    renderWithProviders(<ServiceContactsTable {...defaultProps} />);

    expect(screen.getByText('Site / Lieu')).toBeInTheDocument();
    expect(screen.getByText('E-mail')).toBeInTheDocument();
    expect(screen.getByText('Téléphone')).toBeInTheDocument();
    expect(screen.getByText('Horaires')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
