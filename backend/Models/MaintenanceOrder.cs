namespace DeviceManagementApi.Models;

public class MaintenanceOrder
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Workshop { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Description { get; set; } = string.Empty;
    public List<MaintenanceItem> BrokenMaterials { get; set; } = new();
    public List<MaintenanceItem> ReplacementMaterials { get; set; } = new();
}
