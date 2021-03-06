import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {collectionPath, createTestApp} from '../test-setup/test-app';
import {getFileContent} from '@schematics/angular/utility/test';
import {Schema} from './schema';

describe('material-dashboard-schematic', () => {
  let runner: SchematicTestRunner;

  const baseOptions: Schema = {
    name: 'foo',
    project: 'material',
  };

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath);
  });

  it('should create dashboard files and add them to module', () => {
    const tree = runner.runSchematic('dashboard', baseOptions, createTestApp());
    const files = tree.files;

    expect(files).toContain('/projects/material/src/app/foo/foo.component.css');
    expect(files).toContain('/projects/material/src/app/foo/foo.component.html');
    expect(files).toContain('/projects/material/src/app/foo/foo.component.spec.ts');
    expect(files).toContain('/projects/material/src/app/foo/foo.component.ts');

    const moduleContent = getFileContent(tree, '/projects/material/src/app/app.module.ts');
    expect(moduleContent).toMatch(/import.*Foo.*from '.\/foo\/foo.component'/);
    expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+FooComponent\r?\n/m);
  });

  it('should add dashboard imports to module', () => {
    const tree = runner.runSchematic('dashboard', baseOptions, createTestApp());
    const moduleContent = getFileContent(tree, '/projects/material/src/app/app.module.ts');

    expect(moduleContent).toContain('MatGridListModule');
    expect(moduleContent).toContain('MatCardModule');
    expect(moduleContent).toContain('MatMenuModule');
    expect(moduleContent).toContain('MatIconModule');
    expect(moduleContent).toContain('MatButtonModule');

    expect(moduleContent).toContain(
      // tslint:disable-next-line
      `import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';`);
  });

  describe('styleext option', () => {
    it('should respect the option value', () => {
      const tree = runner.runSchematic(
          'dashboard', {styleext: 'scss', ...baseOptions}, createTestApp());

      expect(tree.files).toContain('/projects/material/src/app/foo/foo.component.scss');
    });

    it('should fallback to the @schematics/angular:component option value', () => {
      const tree = runner.runSchematic('dashboard', baseOptions, createTestApp({style: 'less'}));

      expect(tree.files).toContain('/projects/material/src/app/foo/foo.component.less');
    });
  });

  describe('inlineStyle option', () => {
    it('should respect the option value', () => {
      const tree = runner.runSchematic(
          'dashboard', {inlineStyle: true, ...baseOptions}, createTestApp());

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.css');
    });

    it('should fallback to the @schematics/angular:component option value', () => {
      const tree = runner.runSchematic(
          'dashboard', baseOptions, createTestApp({inlineStyle: true}));

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.css');
    });
  });

  describe('inlineTemplate option', () => {
    it('should respect the option value', () => {
      const tree = runner.runSchematic(
          'dashboard', {inlineTemplate: true, ...baseOptions}, createTestApp());

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.html');
    });

    it('should fallback to the @schematics/angular:component option value', () => {
      const tree = runner.runSchematic(
          'dashboard', baseOptions, createTestApp({inlineTemplate: true}));

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.html');
    });
  });

  describe('spec option', () => {
    it('should respect the option value', () => {
      const tree = runner.runSchematic(
          'dashboard', {spec: false, ...baseOptions}, createTestApp());

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.spec.ts');
    });

    it('should fallback to the @schematics/angular:component option value', () => {
      const tree = runner.runSchematic('dashboard', baseOptions, createTestApp({skipTests: true}));

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.spec.ts');
    });
  });
});
