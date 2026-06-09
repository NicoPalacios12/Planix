using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using planix_api.Data;
using planix_api.Models;
using planix_api.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace planix_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftsController : ControllerBase
    {
        private readonly ShiftService _shiftService;


        public ShiftsController(ShiftService shiftService)
        {
            _shiftService = shiftService;
            
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Shift>>> GetShifts()
        {
            List<Shift>? shifts = await _shiftService.GetAll();
            if (shifts == null) return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(shifts);
        }

        [HttpGet("schedule/{scheduleId}")]
        [Authorize()]
        public async Task<ActionResult<IEnumerable<Shift>>> GetByScheduleId(int scheduleId)
        {


            List<Shift>? shifts = await _shiftService.GetByScheduleId(scheduleId);
            if (shifts == null) return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(shifts);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Shift>> GetShift(int id)
        {
            var shift = await _shiftService.GetById(id);

            if (shift == null)
            {
                return NotFound();
            }

            return shift;
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutShift(int id, Shift shift)
        {
            if (id != shift.Id)
            {
                return BadRequest();
            }

            Shift? updatedShift = await _shiftService.Update(id, shift);

            if (updatedShift == null) return StatusCode(StatusCodes.Status500InternalServerError,
                new { Message = "Operation failed. Please try again." });

            return Ok(updatedShift);
        }


        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Shift>> PostShift(Shift shift)
        {
            Shift? newShift = await _shiftService.Create(shift);
            if (newShift == null) return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(newShift);
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteShift(int id)
        {
            bool deletedSuccess = await _shiftService.Delete(id);
            if (!deletedSuccess)
            {
                return NotFound();
            }

            return Ok(new { Message = "Deletion successful." });
        }

        
    }
}
