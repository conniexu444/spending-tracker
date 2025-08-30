export const APP_CONFIG = {
  name: 'Budget Tracker',
  version: '1.0.0',
  github: {
    url: 'https://github.com/conniexu444',
    label: 'View on GitHub'
  }
} as const;

export const UI_CONFIG = {
  modal: {
    backdropBlur: 'backdrop-blur-sm',
    zIndex: 'z-50'
  },
  animations: {
    hover: 'hover:-translate-y-1 hover:scale-105',
    transition: 'transition transform'
  }
} as const;

export const EXPORT_CONFIG = {
  excel: {
    filename: 'budget-categories',
    extension: '.xlsx'
  },
  pdf: {
    filename: 'budget-report',
    extension: '.pdf'
  }
} as const;

export const VALIDATION = {
  category: {
    minLength: 1,
    maxLength: 50
  },
  subcategory: {
    minLength: 1,
    maxLength: 30
  }
} as const;