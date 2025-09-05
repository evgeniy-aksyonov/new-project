import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectStoreService, Status } from './project-store.service';

describe('ProjectStoreService', () => {
  let service: ProjectStoreService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectStoreService]
    });
    service = TestBed.inject(ProjectStoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load projects from assets', () => {
    const mockProjects = [
      { id: '1', name: 'Test Project', owner: 'John', deadline: '2025-12-01', status: 'active' }
    ];

    const req = httpMock.expectOne('assets/projects.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);

    expect(service.projects()).toEqual(mockProjects);
    expect(service.loading()).toBe(false);
  });

  it('should toggle favorites', () => {
    service.toggleFavorite('1');
    expect(service.favoriteIds().has('1')).toBe(true);

    service.toggleFavorite('1');
    expect(service.favoriteIds().has('1')).toBe(false);
  });

  it('should filter projects by query', () => {
    service.projects.set([
      { id: '1', name: 'Angular Project', owner: 'John', deadline: '2025-12-01', status: 'active' },
      { id: '2', name: 'React Project', owner: 'Jane', deadline: '2025-12-01', status: 'paused' }
    ]);

    service.search('Angular');
    expect(service.filtered().length).toBe(1);
    expect(service.filtered()[0].name).toBe('Angular Project');
  });
});
