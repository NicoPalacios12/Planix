namespace planix_api.DTOs
{
    public class UpdateStatusDTO
    {
        public string Status { get; set; }
        public bool ConfirmShiftDeletion { get; set; } = false;
    }
}
