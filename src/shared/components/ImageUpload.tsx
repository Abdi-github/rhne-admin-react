import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Avatar,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { CloudUpload, DeleteOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ImageUploadProps {
  currentImageUrl?: string;
  onUpload: (file: File) => Promise<string>;
  onRemove?: () => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  variant?: 'rounded' | 'circular' | 'square';
  width?: number;
  height?: number;
}

export function ImageUpload({
  currentImageUrl,
  onUpload,
  onRemove,
  label,
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5,
  variant = 'rounded',
  width = 120,
  height = 120,
}: ImageUploadProps) {
  const { t } = useTranslation('common');
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUrl = preview ?? currentImageUrl;
  const displayLabel = label ?? t('upload_image');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(t('max_size_error', { maxSize: maxSizeMB }));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      setIsUploading(true);
      await onUpload(file);
    } catch {
      setError(t('upload_error'));
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onRemove?.();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={displayUrl}
          variant={variant}
          alt={displayLabel}
          sx={{ width, height, border: '1px solid', borderColor: 'divider' }}
        />
        {isUploading && (
          <CircularProgress
            size={32}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: -2,
              marginLeft: -2,
            }}
          />
        )}
      </Box>
      <Box>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <Button
          startIcon={<CloudUpload />}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          size="small"
          variant="outlined"
        >
          {displayLabel}
        </Button>
        {displayUrl && onRemove && (
          <IconButton
            size="small"
            color="error"
            onClick={handleRemove}
            disabled={isUploading}
            aria-label={t('remove_image')}
            sx={{ ml: 1 }}
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        )}
        {error && (
          <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
