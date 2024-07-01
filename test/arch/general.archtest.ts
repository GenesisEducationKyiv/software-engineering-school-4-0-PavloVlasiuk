import 'tsarch/dist/jest';
import { filesOfProject } from 'tsarch';

describe('architecture', () => {
  const controllers = '/.*.controller.ts$/';
  const services = '/.*.service.ts$/';
  const repositories = '/.*.repository.ts$/';

  it('business logic layer should no depend on presentation layer', async () => {
    console.log(filesOfProject().matchingPattern(services));
    const rule = filesOfProject()
      .matchingPattern(services)
      .shouldNot()
      .dependOnFiles()
      .matchingPattern(controllers);

    await expect(rule).toPassAsync();
  });

  it('presentation layer should not depend on data access layer', async () => {
    const rule = filesOfProject()
      .matchingPattern(controllers)
      .shouldNot()
      .dependOnFiles()
      .matchingPattern(repositories);

    await expect(rule).toPassAsync();
  });

  it('business logic layer should be cycle free', async () => {
    const rule = filesOfProject()
      .matchingPattern(services)
      .should()
      .beFreeOfCycles();

    await expect(rule).toPassAsync();
  });

  it('data access layer should be cycle free', async () => {
    const rule = filesOfProject()
      .matchingPattern(repositories)
      .should()
      .beFreeOfCycles();

    await expect(rule).toPassAsync();
  });
});
