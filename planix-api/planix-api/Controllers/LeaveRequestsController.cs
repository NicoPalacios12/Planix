using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using planix_api.Data;
using planix_api.DTOs;
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
    public class LeaveRequestsController : ControllerBase
    {
        private readonly LeaveRequestService _leaveRequestService;

        public LeaveRequestsController(LeaveRequestService leaveRequestService)
        {
            _leaveRequestService = leaveRequestService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<LeaveRequestResponseDTO>>> GetLeaveRequests()
        {
            List<LeaveRequestResponseDTO>? leaveRequests = await _leaveRequestService.GetAll();
            if(leaveRequests == null) return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(leaveRequests);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<LeaveRequest>> GetLeaveRequest(int id)
        {
            var leaveRequest = await _leaveRequestService.GetById(id);

            if (leaveRequest == null)
            {
                return NotFound();
            }

            return leaveRequest;
        }

        [HttpGet("mine")]
        [Authorize]
        public async Task<ActionResult<LeaveRequest>> GetMyLeaveRequests() 
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            List<LeaveRequest>? leaveRequest = await _leaveRequestService.GetByUserId(userId);
            if(leaveRequest == null) return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(leaveRequest);
        }


        [HttpPatch("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateStatusDTO dto)
        {
            if (dto.Status != "Approved" && dto.Status != "Rejected") 
            {
                return BadRequest(new { Message = "Status must be 'Approved' or 'Rejected'. " });
            }

            LeaveRequest? updatedLeaveRequest = await _leaveRequestService.UpdateStatus(id, dto.Status);
            if (updatedLeaveRequest == null) return NotFound();

            return Ok(updatedLeaveRequest);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<LeaveRequest>> PostLeaveRequest(CreateLeaveRequestDTO dto)
        {
            LeaveRequest leaveRequest = new LeaveRequest
            {
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                UserId = dto.UserId
            };
            LeaveRequest? newLeaveRequest = await _leaveRequestService.Create(leaveRequest);
            if (newLeaveRequest == null) return StatusCode(StatusCodes.Status500InternalServerError);

            return Ok(newLeaveRequest);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteLeaveRequest(int id)
        {
            bool deletedSuccess = await _leaveRequestService.Delete(id);

            if (!deletedSuccess)
            {
                return NotFound();
            }

            return Ok(new { Message = "Deletion successful." });
        }

        
    }
}
