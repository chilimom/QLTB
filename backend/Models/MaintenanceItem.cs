namespace DeviceManagementApi.Models;

public class MaintenanceItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string MaterialCode { get; set; } = string.Empty;
    public string MaterialName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string Note { get; set; } = string.Empty;
}
