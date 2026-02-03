import { TextField, Tabs, Tab, Box } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useState } from 'react';

const LANGUAGES = ['fr', 'en', 'de', 'it'] as const;

interface TranslatedFieldInputProps {
  name: string;
  label: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

export function TranslatedFieldInput({
  name,
  label,
  required,
  multiline,
  rows,
}: TranslatedFieldInputProps) {
  const [tab, setTab] = useState(0);
  const { control } = useFormContext();

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v: number) => setTab(v)} sx={{ mb: 1 }}>
        {LANGUAGES.map((lang) => (
          <Tab key={lang} label={lang.toUpperCase()} sx={{ minWidth: 48 }} />
        ))}
      </Tabs>
      {LANGUAGES.map((lang, i) => (
        <Box key={lang} hidden={tab !== i}>
          {tab === i && (
            <Controller
              name={`${name}.${lang}`}
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={`${label} (${lang.toUpperCase()})`}
                  fullWidth
                  required={required && lang === 'fr'}
                  multiline={multiline}
                  rows={rows}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}
