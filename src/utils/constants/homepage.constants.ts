import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TimelineIcon from '@mui/icons-material/Timeline';
import type { SvgIconComponent } from '@mui/icons-material';

/** Feature con strings ya traducidos (para pasar a FeatureCard) */
export interface Feature {
  icon: SvgIconComponent;
  title: string;
  description: string;
  color: string;
}

/** Feature con claves de traducción (fuente de datos en constants) */
export interface FeatureKey {
  icon: SvgIconComponent;
  titleKey: string;
  descriptionKey: string;
  color: string;
}

/** Stat con string ya traducido (para renderizar) */
export interface Stat {
  value: string;
  label: string;
}

/** Stat con clave de traducción (fuente de datos en constants) */
export interface StatKey {
  value?: string;
  valueKey?: string; // si está presente, se usa t(valueKey) en lugar de value
  labelKey: string;
}

export const HERO_STATS: StatKey[] = [
  { value: '10K+', labelKey: 'landing.stats.books' },
  {
    valueKey: 'landing.stats.updates.value',
    labelKey: 'landing.stats.updates',
  },
  { value: '5+', labelKey: 'landing.stats.features' },
];

export const FEATURES: FeatureKey[] = [
  {
    icon: LocalLibraryIcon,
    titleKey: 'landing.features.smart-library.title',
    descriptionKey: 'landing.features.smart-library.description',
    color: '#9333ea',
  },
  {
    icon: SearchIcon,
    titleKey: 'landing.features.discover.title',
    descriptionKey: 'landing.features.discover.description',
    color: '#a855f7',
  },
  {
    icon: PeopleIcon,
    titleKey: 'landing.features.social.title',
    descriptionKey: 'landing.features.social.description',
    color: '#c084fc',
  },
  {
    icon: WorkspacePremiumIcon,
    titleKey: 'landing.features.hall-of-fame.title',
    descriptionKey: 'landing.features.hall-of-fame.description',
    color: '#FFD700',
  },
  {
    icon: AutoStoriesIcon,
    titleKey: 'landing.features.editions.title',
    descriptionKey: 'landing.features.editions.description',
    color: '#8b5cf6',
  },
  {
    icon: TimelineIcon,
    titleKey: 'landing.features.activity.title',
    descriptionKey: 'landing.features.activity.description',
    color: '#7c3aed',
  },
];

export const CTA_FEATURE_KEYS: string[] = [
  'landing.cta.features.follow',
  'landing.cta.features.share',
];
