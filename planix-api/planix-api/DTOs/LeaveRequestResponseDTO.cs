namespace planix_api.DTOs
{
    public class LeaveRequestResponseDTO
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Reason { get; set; }
        public string Status { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string EmployeeFullName { get; set; } = null!;
    }
}
