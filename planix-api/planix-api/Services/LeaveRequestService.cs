using Microsoft.EntityFrameworkCore;
using planix_api.Data;
using planix_api.Models;
using planix_api.DTOs;

namespace planix_api.Services
{
    public class LeaveRequestService
    {
        private readonly PlanixContext _context;

        public LeaveRequestService(PlanixContext context)
        {
            _context = context;
        }

        private bool IsContextValid() => _context != null && _context.LeaveRequests != null;

        public async Task<List<LeaveRequestResponseDTO>?> GetAll()
        {
            if (!IsContextValid()) return null;

            return await _context.LeaveRequests
                .Include(l => l.User)
                .Select(l => new LeaveRequestResponseDTO
                {
                    Id = l.Id,
                    StartDate = l.StartDate,
                    EndDate = l.EndDate,
                    Status = l.Status!,
                    UserId = l.UserId,
                    EmployeeFullName = l.User!.FullName
                }).ToListAsync();
        }

        public async Task<List<LeaveRequest>?> GetByUserId(string userId)
        {
            if (!IsContextValid()) return null;

            return await _context.LeaveRequests
               .Where(s => s.UserId == userId)
               .ToListAsync();
        }

        public async Task<LeaveRequest?> GetById(int id)
        {
            if (!IsContextValid()) return null;

            return await _context.LeaveRequests
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<LeaveRequest?> Create(LeaveRequest leaveRequest)
        {
            if (!IsContextValid()) return null;

            leaveRequest.Status = "Pending";

            _context.LeaveRequests.Add(leaveRequest);
            await _context.SaveChangesAsync();
            return leaveRequest;
        }

        public async Task<LeaveRequest?> UpdateStatus(int id, string status)
        {
            if (!IsContextValid()) return null;

            LeaveRequest? leaveRequest = await _context.LeaveRequests.FindAsync(id);
            if (leaveRequest == null) return null;

            leaveRequest.Status = status;
            await _context.SaveChangesAsync();

            return leaveRequest;
        }

        public async Task<bool> Delete(int id)
        {
            if (!IsContextValid()) return false;
            LeaveRequest? leaveRequest = await _context.LeaveRequests.FindAsync(id);

            if (leaveRequest == null) return false;

            _context.LeaveRequests.Remove(leaveRequest);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
