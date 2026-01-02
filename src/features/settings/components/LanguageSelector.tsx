import {
  Card,
  CardContent,
  CardHeader,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setLanguage } from '@/shared/state/uiSlice';
import type { SupportedLanguage } from '@/shared/types/common.types';

const LANGUAGES: { value: SupportedLanguage; label: string }[] = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
];

export function LanguageSelector() {
  const { t, i18n } = useTranslation('settings');
  const dispatch = useAppDispatch();
  const currentLang = useAppSelector((state) => state.ui.language);

  const handleChange = (_: React.MouseEvent<HTMLElement>, newLang: SupportedLanguage | null) => {
    if (newLang) {
      dispatch(setLanguage(newLang));
      i18n.changeLanguage(newLang);
    }
  };

  return (
    <Card>
      <CardHeader title={t('language.title')} />
      <CardContent>
        <ToggleButtonGroup
          value={currentLang}
          exclusive
          onChange={handleChange}
          color="primary"
        >
          {LANGUAGES.map((lang) => (
            <ToggleButton key={lang.value} value={lang.value}>
              {lang.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </CardContent>
    </Card>
  );
}
