import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { ServiceLinksTable } from '../components/ServiceLinksTable';
import { mockServiceLinks } from '@/test/data/services';

describe('ServiceLinksTable', () => {
  const defaultProps = {
    links: mockServiceLinks,
    isLoading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders all links', () => {
    renderWithProviders(<ServiceLinksTable {...defaultProps} />);

    expect(screen.getByText('Guide du patient')).toBeInTheDocument();
    expect(screen.getByText('Brochure informative')).toBeInTheDocument();
  });

  it('displays URLs as clickable links with external icon', () => {
    renderWithProviders(<ServiceLinksTable {...defaultProps} />);

    const link1 = screen.getByRole('link', { name: /guide-cardio/i });
    expect(link1).toHaveAttribute('href', 'https://example.com/guide-cardio');
    expect(link1).toHaveAttribute('target', '_blank');
    expect(link1).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows empty state when no links', () => {
    renderWithProviders(
      <ServiceLinksTable {...defaultProps} links={[]} />,
    );

    expect(screen.getByText('Aucun lien trouvé')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', async () => {
    const onEdit = vi.fn();
    const { user } = renderWithProviders(
      <ServiceLinksTable {...defaultProps} onEdit={onEdit} />,
    );

    const rows = screen.getAllByRole('row');
    const firstDataRow = rows[1];
    const buttons = within(firstDataRow).getAllByRole('button');
    await user.click(buttons[0]); // edit is first

    expect(onEdit).toHaveBeenCalledWith(mockServiceLinks[0]);
  });

  it('calls onDelete when delete button clicked', async () => {
    const onDelete = vi.fn();
    const { user } = renderWithProviders(
      <ServiceLinksTable {...defaultProps} onDelete={onDelete} />,
    );

    const rows = screen.getAllByRole('row');
    const firstDataRow = rows[1];
    const buttons = within(firstDataRow).getAllByRole('button');
    await user.click(buttons[1]); // delete is second

    expect(onDelete).toHaveBeenCalledWith('link-1');
  });

  it('renders table headers', () => {
    renderWithProviders(<ServiceLinksTable {...defaultProps} />);

    expect(screen.getByText('Titre du lien')).toBeInTheDocument();
    expect(screen.getByText('URL')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
