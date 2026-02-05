using DeviceManagementApi.Models;
using DeviceManagementApi.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<InMemoryRepository>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();

app.MapGet("/api/materials", (InMemoryRepository repo) => Results.Ok(repo.GetMaterials()));
app.MapGet("/api/materials/{id:guid}", (Guid id, InMemoryRepository repo) =>
{
    var material = repo.GetMaterial(id);
    return material is null ? Results.NotFound() : Results.Ok(material);
});

app.MapPost("/api/materials", (Material material, InMemoryRepository repo) =>
{
    var created = repo.AddMaterial(material);
    return Results.Created($"/api/materials/{created.Id}", created);
});

app.MapPut("/api/materials/{id:guid}", (Guid id, Material material, InMemoryRepository repo) =>
{
    return repo.UpdateMaterial(id, material) ? Results.NoContent() : Results.NotFound();
});

app.MapDelete("/api/materials/{id:guid}", (Guid id, InMemoryRepository repo) =>
{
    return repo.DeleteMaterial(id) ? Results.NoContent() : Results.NotFound();
});

app.MapGet("/api/orders", (InMemoryRepository repo) => Results.Ok(repo.GetOrders()));
app.MapGet("/api/orders/{id:guid}", (Guid id, InMemoryRepository repo) =>
{
    var order = repo.GetOrder(id);
    return order is null ? Results.NotFound() : Results.Ok(order);
});

app.MapPost("/api/orders", (MaintenanceOrder order, InMemoryRepository repo) =>
{
    var created = repo.AddOrder(order);
    return Results.Created($"/api/orders/{created.Id}", created);
});

app.MapGet("/api/stock", (InMemoryRepository repo) => Results.Ok(repo.GetStockSummary()));

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.Run();
