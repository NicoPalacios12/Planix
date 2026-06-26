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
                    Reason = l.Reason,
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

        public enum UpdateStatusResult
        { 
            Success,
            NotFound,
            ShiftNeedsConfirmation
        }

        public async Task<(UpdateStatusResult result, LeaveRequest? leaveRequest)> UpdateStatus(
            int id, string status, bool confirmShiftDeletion)
        {
            if (!IsContextValid()) return (UpdateStatusResult.NotFound, null);

            LeaveRequest? leaveRequest = await _context.LeaveRequests.FindAsync(id);
            if (leaveRequest == null) return (UpdateStatusResult.NotFound, null);

            if (status == "Approved")
            {
                List<Shift> conflictingShifts = await _context.Shifts
                    .Where(s => s.Schedule.UserId == leaveRequest.UserId &&
                                s.Date.Date >= leaveRequest.StartDate.Date &&
                                s.Date.Date <= leaveRequest.EndDate.Date)
                    .ToListAsync();

                if (conflictingShifts.Any())
                {
                    
                    if (!confirmShiftDeletion)
                        return (UpdateStatusResult.ShiftNeedsConfirmation, leaveRequest);

                    
                    _context.Shifts.RemoveRange(conflictingShifts);
                }
            }

            leaveRequest.Status = status;
            await _context.SaveChangesAsync();
            return (UpdateStatusResult.Success, leaveRequest);
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
