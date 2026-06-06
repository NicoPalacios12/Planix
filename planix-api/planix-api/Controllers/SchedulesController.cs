using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using planix_api.Data;
using planix_api.Models;
using planix_api.Services;

namespace planix_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchedulesController : ControllerBase
    {
        private readonly ScheduleService _scheduleService;

        public SchedulesController(ScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }


        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedules()
        {
            List<Schedule>? schedules = await _scheduleService.GetAll();
            if (schedules == null) return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(schedules);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Schedule>> GetSchedule(int id)
        {
            Schedule? schedule = await _scheduleService.GetById(id);

            if (schedule == null)
            {
                return NotFound();
            }

            return Ok(schedule);
        }


        [HttpGet("mine")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetMySchedules()
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            List<Schedule>? schedules = await _scheduleService.GetByUserId(userId);
            if (schedules == null) return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(schedules);
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutSchedule(int id, Schedule schedule)
        {
            if (id != schedule.Id)
            {
                return BadRequest();
            }

            Schedule? updatedSchedule = await _scheduleService.Update(id, schedule);

            if(updatedSchedule == null) return StatusCode(StatusCodes.Status500InternalServerError,
                new { Message = "Operation failed. Please try again." });

            return Ok(updatedSchedule);
        }


        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Schedule>> PostSchedule(Schedule schedule)
        {
            Schedule? newSchedule = await _scheduleService.Create(schedule);
            if (newSchedule == null) return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(newSchedule);
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            bool deletedSuccess = await _scheduleService.Delete(id);
            if (!deletedSuccess)
            {
                return NotFound();
            }

            return Ok(new {Message = "Deletion successful." });
        }
    }
}
