using Microsoft.EntityFrameworkCore;
using planix_api.Data;
using planix_api.Models;

namespace planix_api.Services
{
    public class ScheduleService
    {
        private readonly PlanixContext _context;

        public ScheduleService(PlanixContext context) 
        {
            _context = context;
        }

        private bool IsContextValid() => _context != null && _context.Schedules != null;

        public async Task<List<Schedule>?> GetAll() 
        {
            if (!IsContextValid()) return null;

            return await _context.Schedules.ToListAsync();
        }

        public async Task<List<Schedule>?> GetByUserId(string userId) 
        {
            if (!IsContextValid()) return null;

             return await _context.Schedules
                .Where(s => s.UserId == userId)
                .Include(s => s.Shifts)
                .ToListAsync();
        }

        public async Task<Schedule?> GetById(int id) 
        {
            if (!IsContextValid()) return null;

            return await _context.Schedules
                .Include(s => s.Shifts)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Schedule?> Create(Schedule schedule)
        {
            if (!IsContextValid()) return null;

            _context.Schedules.Add(schedule);
            await _context.SaveChangesAsync();
            return schedule;
        }

        public async Task<Schedule?> Update(int id, Schedule schedule)
        {
            if (!IsContextValid()) return null;

            _context.Entry(schedule).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) 
            {
                if (await GetById(id) == null) return null;
                else throw;
            }

            return schedule;
        }

        public async Task<bool> Delete(int id)
        {
            if (!IsContextValid()) return false;
            Schedule? schedule = await _context.Schedules.FindAsync(id);

            if (schedule == null) return false;

            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return true;
        }

    }
}
