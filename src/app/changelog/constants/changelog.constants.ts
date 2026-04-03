import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BarChartIcon from '@mui/icons-material/BarChart';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import GroupsIcon from '@mui/icons-material/Groups';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

export interface ChangelogFeature {
  messageId: string;
  icon: React.ElementType;
}

export interface ChangelogVersion {
  version: string;
  dateMessageId: string;
  titleMessageId: string;
  introMessageId: string;
  isLatest?: boolean;
  features: ChangelogFeature[];
}

/**
 * Changelog versions ordered newest-first.
 * Each messageId maps to a key in app.lang.ts.
 */
export const CHANGELOG_VERSIONS: ChangelogVersion[] = [
  {
    version: '1.1',
    dateMessageId: 'changelog.v1-1.date',
    titleMessageId: 'changelog.v1-1.title',
    introMessageId: 'changelog.v1-1.intro',
    isLatest: true,
    features: [
      { messageId: 'changelog.v1-1.feature.2', icon: DragIndicatorIcon }, // Listas
      { messageId: 'changelog.v1-1.feature.3', icon: ImportExportIcon }, // Import
      { messageId: 'changelog.v1-1.feature.1', icon: LanguageIcon }, // Idiomas
    ],
  },
  {
    version: '1.0',
    dateMessageId: 'changelog.v1-0.date',
    titleMessageId: 'changelog.v1-0.title',
    introMessageId: 'changelog.v1-0.intro',
    features: [
      { messageId: 'changelog.v1-0.feature.1', icon: AutoStoriesIcon },
      { messageId: 'changelog.v1-0.feature.2', icon: GroupsIcon },
      { messageId: 'changelog.v1-0.feature.3', icon: WorkspacePremiumIcon },
      { messageId: 'changelog.v1-0.feature.4', icon: BarChartIcon },
      { messageId: 'changelog.v1-0.feature.5', icon: PersonIcon },
    ],
  },
];
