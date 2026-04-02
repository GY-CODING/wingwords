import React from 'react';
import { statusOptions } from './BookRatingOptions';
import { EStatus } from '@/utils/constants/EStatus';

describe('BookRatingOptions', () => {
  it('exports correct number of status options', () => {
    expect(statusOptions).toHaveLength(3);
  });

  it('contains Want to read option', () => {
    const wantToReadOption = statusOptions.find(
      (option) => option.value === EStatus.WANT_TO_READ
    );

    expect(wantToReadOption).toBeDefined();
    expect(wantToReadOption?.labelKey).toBe('book.rating.status.wantToRead');
    expect(wantToReadOption?.icon).toBeDefined();
  });

  it('contains Reading option', () => {
    const readingOption = statusOptions.find(
      (option) => option.value === EStatus.READING
    );

    expect(readingOption).toBeDefined();
    expect(readingOption?.labelKey).toBe('book.rating.status.reading');
    expect(readingOption?.icon).toBeDefined();
  });

  it('contains Read option', () => {
    const readOption = statusOptions.find(
      (option) => option.value === EStatus.READ
    );

    expect(readOption).toBeDefined();
    expect(readOption?.labelKey).toBe('book.rating.status.read');
    expect(readOption?.icon).toBeDefined();
  });

  it('all options have required properties', () => {
    statusOptions.forEach((option) => {
      expect(option).toHaveProperty('labelKey');
      expect(option).toHaveProperty('value');
      expect(option).toHaveProperty('icon');
      expect(typeof option.labelKey).toBe('string');
      expect(Object.values(EStatus)).toContain(option.value);
      expect(React.isValidElement(option.icon)).toBe(true);
    });
  });

  it('has unique values for all options', () => {
    const values = statusOptions.map((option) => option.value);
    const uniqueValues = [...new Set(values)];
    expect(values).toHaveLength(uniqueValues.length);
  });

  it('has unique labels for all options', () => {
    const labels = statusOptions.map((option) => option.labelKey);
    const uniqueLabels = [...new Set(labels)];
    expect(labels).toHaveLength(uniqueLabels.length);
  });

  it('options are in the expected order', () => {
    expect(statusOptions[0].value).toBe(EStatus.WANT_TO_READ);
    expect(statusOptions[1].value).toBe(EStatus.READING);
    expect(statusOptions[2].value).toBe(EStatus.READ);
  });

  it('all labels are non-empty strings', () => {
    statusOptions.forEach((option) => {
      expect(option.labelKey).toBeTruthy();
      expect(option.labelKey.length).toBeGreaterThan(0);
    });
  });

  it('all icons are React elements', () => {
    statusOptions.forEach((option) => {
      expect(React.isValidElement(option.icon)).toBe(true);
      expect(option.icon.type).toBeDefined();
    });
  });

  it('icons have correct Material-UI icon types', () => {
    const wantToReadOption = statusOptions.find(
      (option) => option.value === EStatus.WANT_TO_READ
    );
    const readingOption = statusOptions.find(
      (option) => option.value === EStatus.READING
    );
    const readOption = statusOptions.find(
      (option) => option.value === EStatus.READ
    );

    // Check that icons are Material-UI components (they should have a type property)
    expect(wantToReadOption?.icon.type).toBeDefined();
    expect(readingOption?.icon.type).toBeDefined();
    expect(readOption?.icon.type).toBeDefined();
  });

  it('exports StatusOption interface correctly', () => {
    statusOptions.forEach((option) => {
      const keys = Object.keys(option);
      expect(keys).toContain('labelKey');
      expect(keys).toContain('value');
      expect(keys).toContain('icon');
      expect(keys).toHaveLength(3);
    });
  });

  it('handles EStatus enum values correctly', () => {
    const expectedStatuses = [
      EStatus.WANT_TO_READ,
      EStatus.READING,
      EStatus.READ,
    ];
    const actualStatuses = statusOptions.map((option) => option.value);

    expectedStatuses.forEach((status) => {
      expect(actualStatuses).toContain(status);
    });
  });

  it('maintains consistent naming convention', () => {
    statusOptions.forEach((option) => {
      // labelKey should follow dot-notation i18n convention
      expect(option.labelKey).toMatch(/^[a-z].*\..*/);

      // Values should match EStatus enum pattern
      expect(typeof option.value).toBe('string');
    });
  });
});
