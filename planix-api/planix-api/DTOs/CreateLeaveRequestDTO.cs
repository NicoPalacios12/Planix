namespace planix_api.DTOs
{
    public class CreateLeaveRequestDTO
    {
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string UserId { get; set; } = null!;
    }
}
