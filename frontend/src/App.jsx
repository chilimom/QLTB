import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:5000/api";

const tabs = [
  { id: "materials", label: "Quản lý vật tư" },
  { id: "orders", label: "Lệnh bảo trì" },
  { id: "stock", label: "Tồn kho" }
];

const emptyMaterial = {
  id: "",
  code: "",
  name: "",
  quantity: 0,
  unit: "cái"
};

export default function App() {
  const [activeTab, setActiveTab] = useState("materials");
  const [materials, setMaterials] = useState([]);
  const [orders, setOrders] = useState([]);
  const [materialForm, setMaterialForm] = useState(emptyMaterial);
  const [materialMessage, setMaterialMessage] = useState("");
  const [orderForm, setOrderForm] = useState({
    workshop: "",
    description: "",
    brokenMaterials: [],
    replacementMaterials: []
  });

  const fetchMaterials = async () => {
    const response = await fetch(`${API_BASE}/materials`);
    const data = await response.json();
    setMaterials(data);
  };

  const fetchOrders = async () => {
    const response = await fetch(`${API_BASE}/orders`);
    const data = await response.json();
    setOrders(data);
  };

  const fetchAll = () => {
    fetchMaterials();
    fetchOrders();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleMaterialChange = (field, value) => {
    setMaterialForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetMaterialForm = () => {
    setMaterialForm(emptyMaterial);
  };

  const submitMaterial = async (event) => {
    event.preventDefault();
    setMaterialMessage("");
    const payload = {
      code: materialForm.code,
      name: materialForm.name,
      quantity: Number(materialForm.quantity),
      unit: materialForm.unit
    };

    if (materialForm.id) {
      await fetch(`${API_BASE}/materials/${materialForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setMaterialMessage("Đã cập nhật vật tư.");
    } else {
      await fetch(`${API_BASE}/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setMaterialMessage("Đã thêm vật tư mới.");
    }
    resetMaterialForm();
    fetchMaterials();
  };

  const editMaterial = (material) => {
    setMaterialForm({
      id: material.id,
      code: material.code,
      name: material.name,
      quantity: material.quantity,
      unit: material.unit
    });
    setMaterialMessage("");
  };

  const deleteMaterial = async (id) => {
    await fetch(`${API_BASE}/materials/${id}`, { method: "DELETE" });
    if (materialForm.id === id) {
      resetMaterialForm();
    }
    fetchMaterials();
  };

  const addItem = (type) => {
    setOrderForm((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        { materialCode: "", materialName: "", quantity: 0, note: "" }
      ]
    }));
  };

  const updateOrderItem = (type, index, field, value) => {
    setOrderForm((prev) => {
      const items = [...prev[type]];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, [type]: items };
    });
  };

  const removeOrderItem = (type, index) => {
    setOrderForm((prev) => {
      const items = prev[type].filter((_, idx) => idx !== index);
      return { ...prev, [type]: items };
    });
  };

  const submitOrder = async (event) => {
    event.preventDefault();
    const payload = {
      workshop: orderForm.workshop,
      description: orderForm.description,
      brokenMaterials: orderForm.brokenMaterials.map((item) => ({
        materialCode: item.materialCode,
        materialName: item.materialName,
        quantity: Number(item.quantity),
        note: item.note
      })),
      replacementMaterials: orderForm.replacementMaterials.map((item) => ({
        materialCode: item.materialCode,
        materialName: item.materialName,
        quantity: Number(item.quantity),
        note: item.note
      }))
    };

    await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setOrderForm({
      workshop: "",
      description: "",
      brokenMaterials: [],
      replacementMaterials: []
    });
    fetchOrders();
  };

  const stockSummary = useMemo(() => materials, [materials]);

  return (
    <div className="container">
      <header>
        <div>
          <h1>Hệ thống quản lý thiết bị</h1>
          <p>Quản lý vật tư, lệnh bảo trì và tồn kho theo mã vật tư.</p>
        </div>
        <nav>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {activeTab === "materials" && (
        <>
          <div className="card">
            <div className="section-title">
              <h2>Thêm / cập nhật vật tư</h2>
              {materialMessage && <span className="badge">{materialMessage}</span>}
            </div>
            <form onSubmit={submitMaterial} className="grid two">
              <label>
                Mã vật tư
                <input
                  value={materialForm.code}
                  onChange={(event) => handleMaterialChange("code", event.target.value)}
                  placeholder="VD: VT-010"
                  required
                />
              </label>
              <label>
                Tên vật tư
                <input
                  value={materialForm.name}
                  onChange={(event) => handleMaterialChange("name", event.target.value)}
                  placeholder="VD: Vòng bi"
                  required
                />
              </label>
              <label>
                Số lượng
                <input
                  type="number"
                  min="0"
                  value={materialForm.quantity}
                  onChange={(event) => handleMaterialChange("quantity", event.target.value)}
                  required
                />
              </label>
              <label>
                Đơn vị
                <input
                  value={materialForm.unit}
                  onChange={(event) => handleMaterialChange("unit", event.target.value)}
                />
              </label>
              <div>
                <button className="primary" type="submit">
                  {materialForm.id ? "Cập nhật" : "Thêm vật tư"}
                </button>
                {materialForm.id && (
                  <button
                    className="secondary"
                    type="button"
                    onClick={resetMaterialForm}
                    style={{ marginLeft: "12px" }}
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card">
            <div className="section-title">
              <h2>Danh sách vật tư</h2>
              <span className="badge">{materials.length} vật tư</span>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Mã vật tư</th>
                  <th>Tên vật tư</th>
                  <th>Số lượng</th>
                  <th>Đơn vị</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material.id}>
                    <td>{material.code}</td>
                    <td>{material.name}</td>
                    <td>{material.quantity}</td>
                    <td>{material.unit}</td>
                    <td>
                      <button className="secondary" onClick={() => editMaterial(material)}>
                        Sửa
                      </button>
                      <button
                        className="secondary"
                        onClick={() => deleteMaterial(material.id)}
                        style={{ marginLeft: "8px" }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "orders" && (
        <>
          <div className="card">
            <div className="section-title">
              <h2>Tạo lệnh bảo trì</h2>
              <span className="badge">Theo xưởng</span>
            </div>
            <form onSubmit={submitOrder} className="grid">
              <label>
                Xưởng
                <input
                  value={orderForm.workshop}
                  onChange={(event) => setOrderForm((prev) => ({ ...prev, workshop: event.target.value }))}
                  placeholder="VD: Xưởng cơ khí A"
                  required
                />
              </label>
              <label>
                Mô tả công việc
                <textarea
                  rows="3"
                  value={orderForm.description}
                  onChange={(event) => setOrderForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </label>

              <div className="card">
                <div className="section-title">
                  <h2>Vật tư hỏng</h2>
                  <button className="secondary" type="button" onClick={() => addItem("brokenMaterials")}>
                    + Thêm vật tư hỏng
                  </button>
                </div>
                {orderForm.brokenMaterials.length === 0 && <p>Chưa có vật tư hỏng.</p>}
                {orderForm.brokenMaterials.map((item, index) => (
                  <div className="grid two" key={`broken-${index}`}>
                    <label>
                      Mã vật tư
                      <input
                        value={item.materialCode}
                        onChange={(event) => updateOrderItem("brokenMaterials", index, "materialCode", event.target.value)}
                      />
                    </label>
                    <label>
                      Tên vật tư
                      <input
                        value={item.materialName}
                        onChange={(event) => updateOrderItem("brokenMaterials", index, "materialName", event.target.value)}
                      />
                    </label>
                    <label>
                      Số lượng
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(event) => updateOrderItem("brokenMaterials", index, "quantity", event.target.value)}
                      />
                    </label>
                    <label>
                      Ghi chú
                      <input
                        value={item.note}
                        onChange={(event) => updateOrderItem("brokenMaterials", index, "note", event.target.value)}
                      />
                    </label>
                    <div>
                      <button className="secondary" type="button" onClick={() => removeOrderItem("brokenMaterials", index)}>
                        Xóa dòng
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="section-title">
                  <h2>Vật tư xuất thay thế</h2>
                  <button className="secondary" type="button" onClick={() => addItem("replacementMaterials")}>
                    + Thêm vật tư thay thế
                  </button>
                </div>
                {orderForm.replacementMaterials.length === 0 && <p>Chưa có vật tư thay thế.</p>}
                {orderForm.replacementMaterials.map((item, index) => (
                  <div className="grid two" key={`replacement-${index}`}>
                    <label>
                      Mã vật tư
                      <input
                        value={item.materialCode}
                        onChange={(event) => updateOrderItem("replacementMaterials", index, "materialCode", event.target.value)}
                      />
                    </label>
                    <label>
                      Tên vật tư
                      <input
                        value={item.materialName}
                        onChange={(event) => updateOrderItem("replacementMaterials", index, "materialName", event.target.value)}
                      />
                    </label>
                    <label>
                      Số lượng
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(event) => updateOrderItem("replacementMaterials", index, "quantity", event.target.value)}
                      />
                    </label>
                    <label>
                      Ghi chú
                      <input
                        value={item.note}
                        onChange={(event) => updateOrderItem("replacementMaterials", index, "note", event.target.value)}
                      />
                    </label>
                    <div>
                      <button className="secondary" type="button" onClick={() => removeOrderItem("replacementMaterials", index)}>
                        Xóa dòng
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <button className="primary" type="submit">
                  Tạo lệnh
                </button>
              </div>
            </form>
          </div>

          <div className="card">
            <div className="section-title">
              <h2>Danh sách lệnh bảo trì</h2>
              <span className="badge">{orders.length} lệnh</span>
            </div>
            {orders.length === 0 ? (
              <p>Chưa có lệnh bảo trì.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="card">
                  <div className="section-title">
                    <h2>{order.workshop}</h2>
                    <span className="badge">{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
                  </div>
                  <p>{order.description}</p>
                  <div className="taglist">
                    <span className="badge">Vật tư hỏng: {order.brokenMaterials.length}</span>
                    <span className="badge">Vật tư thay thế: {order.replacementMaterials.length}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === "stock" && (
        <div className="card">
          <div className="section-title">
            <h2>Thống kê tồn kho</h2>
            <span className="badge">Theo mã vật tư</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Mã vật tư</th>
                <th>Tên vật tư</th>
                <th>Số lượng tồn</th>
                <th>Đơn vị</th>
              </tr>
            </thead>
            <tbody>
              {stockSummary.map((material) => (
                <tr key={material.id}>
                  <td>{material.code}</td>
                  <td>{material.name}</td>
                  <td>{material.quantity}</td>
                  <td>{material.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer>
        Gợi ý: chạy backend tại <strong>http://localhost:5000</strong> và frontend tại <strong>http://localhost:5173</strong>.
      </footer>
    </div>
  );
}
