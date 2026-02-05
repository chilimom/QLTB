# QLTB - Quản lý thiết bị

Dự án mẫu quản lý thiết bị bao gồm:
- Quản lý vật tư (thêm, sửa, xóa số lượng).
- Tạo lệnh bảo trì theo xưởng.
- Theo dõi vật tư hỏng và vật tư xuất thay thế.
- Thống kê tồn kho theo mã vật tư.

## Kiến trúc
- **Frontend**: React (Vite).
- **Backend**: ASP.NET Core minimal API (C# .NET 8).

## Cách chạy backend
```bash
cd backend
dotnet run
```
Backend chạy mặc định ở `http://localhost:5000`.

## Cách chạy frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend chạy tại `http://localhost:5173`.

## API chính
- `GET /api/materials`
- `POST /api/materials`
- `PUT /api/materials/{id}`
- `DELETE /api/materials/{id}`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/stock`
