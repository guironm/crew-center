import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { UsersService } from '../users/users.service';
import { UserToEmployeePipe } from './pipes/user-to-employee.pipe';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let usersService: UsersService;

  const mockUsersService = {
    getRandomUsers: jest.fn(),
  };

  const mockUserToEmployeePipe = {
    transform: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: UserToEmployeePipe, useValue: mockUserToEmployeePipe },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all employees', async () => {
      // Mock the behavior of getRandomUsers
      mockUsersService.getRandomUsers.mockResolvedValue([
        {
          name: { first: 'John', last: 'Doe' },
          email: 'john@example.com',
          picture: { large: 'url' },
        },
      ]);

      // Mock the behavior of transform
      mockUserToEmployeePipe.transform.mockReturnValue({
        id: 10,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Developer',
        department: 'Engineering',
        salary: 95000,
        status: 'active',
        picture: 'url',
      });

      const result = await service.findAll();

      // Verify we have static employees plus the transformed random user
      expect(result.length).toBeGreaterThanOrEqual(3);
      expect(mockUsersService.getRandomUsers).toHaveBeenCalledWith(5);
      expect(mockUserToEmployeePipe.transform).toHaveBeenCalled();
    });

    it('should return only static employees if API call fails', async () => {
      mockUsersService.getRandomUsers.mockRejectedValue(new Error('API error'));

      const result = await service.findAll();

      // Should have at least the static employees
      expect(result.length).toBeGreaterThanOrEqual(3);
      expect(mockUsersService.getRandomUsers).toHaveBeenCalledWith(5);
      expect(mockUserToEmployeePipe.transform).not.toHaveBeenCalled();
    });
  });
});
