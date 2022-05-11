import AccessRight from '@/domain/access-rights/AccessRight.model';
import AccessType from '@/domain/access-rights/types/AccessType';
import AppSection from '@/domain/access-rights/types/AppSection';

describe('AccessRight.model', () => {
  it('::new', () => {
    const appSection = AppSection.APARTMENTS;
    const accessType = AccessType.READ;

    const accessRight = AccessRight.new({
      appSection,
      accessType,
    });

    expect(accessRight).toBeInstanceOf(AccessRight);
  });
});
