using DeviceManagementApi.Models;

namespace DeviceManagementApi.Repositories;

public class InMemoryRepository
{
    private readonly List<Material> _materials = new();
    private readonly List<MaintenanceOrder> _orders = new();

    public InMemoryRepository()
    {
        _materials.AddRange(new[]
        {
            new Material { Code = "VT-001", Name = "Ổ bi", Quantity = 120, Unit = "cái" },
            new Material { Code = "VT-002", Name = "Dây curoa", Quantity = 45, Unit = "bộ" },
            new Material { Code = "VT-003", Name = "Bơm dầu", Quantity = 12, Unit = "cái" }
        });
    }

    public IEnumerable<Material> GetMaterials() => _materials;

    public Material? GetMaterial(Guid id) => _materials.FirstOrDefault(m => m.Id == id);

    public Material? GetMaterialByCode(string code) => _materials.FirstOrDefault(m => m.Code.Equals(code, StringComparison.OrdinalIgnoreCase));

    public Material AddMaterial(Material material)
    {
        material.Id = Guid.NewGuid();
        _materials.Add(material);
        return material;
    }

    public bool UpdateMaterial(Guid id, Material update)
    {
        var existing = GetMaterial(id);
        if (existing is null)
        {
            return false;
        }

        existing.Code = update.Code;
        existing.Name = update.Name;
        existing.Quantity = update.Quantity;
        existing.Unit = update.Unit;
        return true;
    }

    public bool DeleteMaterial(Guid id)
    {
        var existing = GetMaterial(id);
        if (existing is null)
        {
            return false;
        }

        _materials.Remove(existing);
        return true;
    }

    public IEnumerable<MaintenanceOrder> GetOrders() => _orders;

    public MaintenanceOrder? GetOrder(Guid id) => _orders.FirstOrDefault(o => o.Id == id);

    public MaintenanceOrder AddOrder(MaintenanceOrder order)
    {
        order.Id = Guid.NewGuid();
        order.CreatedAt = DateTime.UtcNow;
        _orders.Add(order);
        return order;
    }

    public IEnumerable<Material> GetStockSummary() => _materials.OrderBy(m => m.Code);
}
