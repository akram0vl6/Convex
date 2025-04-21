import { useState } from "react";
import "./ProfileCatigory.css";
import { useUserProducts } from "../../hooks/useUserProducts";
import { enqueueSnackbar } from "notistack";




const YourProduct = () => {
  const { data, setData, isLoading } = useUserProducts();
  const [activeTab, setActiveTab] = useState("product");
  const handleTabClick = (tab: any) => {
    setActiveTab(tab); // Устанавливаем активный раздел при клике
  };
  const [form, setForm] = useState({
    name: "",
    title: "",
    price: "",
    img: null as File | null,
    weight: "",
    category: "",
    like: 0,
    sold: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files) {
      setForm((prev) => ({
        ...prev,
        [name]: files[0], // сохраняем именно файл
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const token = localStorage.getItem("token");
  console.log(token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("weight", form.weight);
    formData.append("category", form.category);
    formData.append("like", form.like);
    formData.append("sold", form.sold);
    if (form.img) {
      formData.append("img", form.img);
    }

    try {
      const response = await fetch("http://localhost:4444/api/newProduct", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.log(
          `Ошибка при добавлении продукта: ${response.statusText}`
        );
      }

      enqueueSnackbar("Продукт добавлен:", { variant: "success" });
      const result = await response.json();
      console.log("Продукт добавлен:", result);
      setForm({
        name: "",
        title: "",
        price: "",
        img: null,
        weight: "",
        category: "",
        like: 0,
        sold: 0,
      });
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      enqueueSnackbar("Ошибка при отправке формы:", { variant: "error" });
    }
  };

  const handlDelete = async (_id: string) => {
    try {
      const res = await fetch(`http://localhost:4444/api/products/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Ошибка при удалении");
      }

      // Удаляем товар из стейта
      setData((prev: any) => ({
        ...prev,
        products: prev.products.filter((p: any) => p._id !== _id),
      }));

      enqueueSnackbar("Продукт удален:", { variant: "success" });

    } catch (e) {
      console.log("Ошибка при удалении:", e);
      enqueueSnackbar("Ошибка при удалении:", { variant: "error" });
    }
  };



  return (
    <div>
      <div className="yourproduct-nav promocode-nav">
        <li
          className={activeTab === "product" ? "active" : ""}
          onClick={() => handleTabClick("product")}
        >
          <p>Ваши товары</p>
        </li>
        <li
          className={activeTab === "addproduct" ? "active" : ""}
          onClick={() => handleTabClick("addproduct")}
        >
          Добавить товар
        </li>
        {/* <li
          className={activeTab === "add" ? "active" : ""}
          onClick={() => handleTabClick("add")}
        >
          Добавить промокод
        </li> */}
      </div>
      {activeTab === "product" && (
        <div className="your-products-row">
          <h1>Ваши товары</h1>
          <div>
            {isLoading ? (
              <p>Загрузка...</p>
            ) : data && data.products && data.products.length > 0 ? (
              data.products.map((product: any, index: number) => (
                <div key={index} className="your-products">
                  <img
                    src={`http://localhost:4444/${product.img}`}
                    alt={product.name}
                  />
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.title}</p>
                    <p>Вес: {product.weight}гр</p>
                  </div>
                  <div className="products-info">
                    <p className="price">{product.price} ₽</p>
                    <p>
                      {" "}
                      <strong>Лайк:</strong> {product.like}{" "}
                    </p>
                    <p>
                      <strong>Продона:</strong>
                      {product.sold}
                    </p>
                    <p>{product.category}</p>
                  </div>
                  <div className="products-btn">
                    <button onClick={() => handlDelete(product._id)}>
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>У вас нет товаров.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "addproduct" && (
        <div className="add-product">
          <h2>Добавить товар</h2>
          <form onSubmit={handleSubmit} className="product-row">
            <div className="product-input">
              <div className="product-row1">
                <div>
                  <label>Название:</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Описание (title):</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Цена:</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="product-row2">
                <div>
                  <label>Изображение:</label>
                  <input
                    type="file"
                    name="img"
                    onChange={handleChange}
                    accept="image/*"
                    required
                  />
                </div>
                <div>
                  <label>Вес (грамм):</label>
                  <input
                    type="number"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Категория:</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <button type="submit">Добавить товар</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default YourProduct;
