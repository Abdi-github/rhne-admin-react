import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  IconButton,
  Button,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TranslatedFieldInput } from '@/shared/components/TranslatedFieldInput';

interface SectionEditorProps {
  name: string;
}

export function SectionEditor({ name }: SectionEditorProps) {
  const { t } = useTranslation(['patient-info']);
  const { control } = useFormContext();

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control,
    name,
  });

  return (
    <Card>
      <CardHeader
        title={t('patient-info:sections')}
        action={
          <Button
            startIcon={<Add />}
            size="small"
            onClick={() =>
              appendSection({
                id: `section-${Date.now()}`,
                title: { fr: '', en: '', de: '', it: '' },
                content: { fr: '', en: '', de: '', it: '' },
                list_items: [],
              })
            }
          >
            {t('patient-info:add_section')}
          </Button>
        }
      />
      <CardContent>
        {sectionFields.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('patient-info:no_sections')}
          </Typography>
        ) : (
          <Stack spacing={3}>
            {sectionFields.map((sectionField, sectionIndex) => (
              <Card key={sectionField.id} variant="outlined">
                <CardHeader
                  title={`${t('patient-info:section')} ${sectionIndex + 1}`}
                  titleTypographyProps={{ variant: 'subtitle1' }}
                  action={
                    <IconButton
                      color="error"
                      onClick={() => removeSection(sectionIndex)}
                      aria-label={t('patient-info:remove_section')}
                    >
                      <Delete />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Stack spacing={2.5}>
                    <TranslatedFieldInput
                      name={`${name}.${sectionIndex}.title`}
                      label={t('patient-info:section_title')}
                      required
                    />
                    <TranslatedFieldInput
                      name={`${name}.${sectionIndex}.content`}
                      label={t('patient-info:section_content')}
                      multiline
                      rows={3}
                    />
                    <Divider />
                    <ListItemsEditor
                      parentName={`${name}.${sectionIndex}.list_items`}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

// ── Nested List Items Editor ──
function ListItemsEditor({ parentName }: { parentName: string }) {
  const { t } = useTranslation(['patient-info']);
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: parentName,
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2">{t('patient-info:list_items')}</Typography>
        <Button
          startIcon={<Add />}
          size="small"
          onClick={() => append({ fr: '', en: '', de: '', it: '' })}
        >
          {t('patient-info:add_list_item')}
        </Button>
      </Box>
      {fields.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('patient-info:no_list_items')}
        </Typography>
      ) : (
        <Stack spacing={2}>
          {fields.map((field, index) => (
            <Box key={field.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <TranslatedFieldInput
                  name={`${parentName}.${index}`}
                  label={`${t('patient-info:list_items')} ${index + 1}`}
                />
              </Box>
              <IconButton
                color="error"
                onClick={() => remove(index)}
                aria-label={t('patient-info:remove_list_item')}
                sx={{ mt: 1 }}
              >
                <Delete />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
