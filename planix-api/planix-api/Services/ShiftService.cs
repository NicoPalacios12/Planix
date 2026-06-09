using Microsoft.EntityFrameworkCore;
using planix_api.Data;
using planix_api.Models;

namespace planix_api.Services
{
    public class ShiftService
    {
        private readonly PlanixContext _context;

        public ShiftService(PlanixContext context)
        {
            _context = context;
        }

        private bool IsContextValid() => _context != null && _context.Shifts != null;

        public async Task<List<Shift>?> GetAll()
        {
            if (!IsContextValid()) return null;

            return await _context.Shifts.ToListAsync();
        }

        public async Task<List<Shift>?> GetByScheduleId(int scheduleId)
        {
            if (!IsContextValid()) return null;

            return await _context.Shifts
               .Where(s => s.ScheduleId == scheduleId)
               .ToListAsync();
        }

        public async Task<Shift?> GetById(int id)
        {
            if (!IsContextValid()) return null;

            return await _context.Shifts
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Shift?> Create(Shift shift)
        {
            if (!IsContextValid()) return null;

            _context.Shifts.Add(shift);
            await _context.SaveChangesAsync();
            return shift;
        }

        public async Task<Shift?> Update(int id, Shift shift)
        {
            if (!IsContextValid()) return null;

            _context.Entry(shift).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (await GetById(id) == null) return null;
                else throw;
            }

            return shift;
        }

        public async Task<bool> Delete(int id)
        {
            if (!IsContextValid()) return false;
            Shift? shift = await _context.Shifts.FindAsync(id);

            if (shift == null) return false;

            _context.Shifts.Remove(shift);
            await _context.SaveChangesAsync();

            return true;
        }

    }
}
