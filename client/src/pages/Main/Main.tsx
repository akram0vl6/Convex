import Products from '../../components/Products/Products';


import './Main.css'


const Main = () => {



  return (
    <div className="main">
      <div className="main-1 " data-aos="fade-left">
        <div className="main-title">
          <h1>
            Всегда свежие <br /> молочные продукты
          </h1>
          <p>Только качественные товары, за которыми мы всегда следим</p>
          <button>Подробнее</button>
        </div>
        <div className="main-img">
          <img src="/assets/main-car.png" alt="" />
        </div>
      </div>
      <div className="main-2">
        <div className="main-item item1" data-aos="fade-right">
          <img src="/assets/img1.png" alt="" />
          <h5>Горячие блюда</h5>
          <p>Вкуснейшие блюда из 4 ресторанов</p>
        </div>
        <div className="main-item item2" data-aos="fade-right">
          <img src="/assets/img2.png" alt="" />
          <h5>Новинки</h5>
          <p>Новые позиции</p>
        </div>
        <div className="main-item item3" data-aos="fade-right">
          <img src="/assets/img3.png" alt="" />
          <h5>Акции</h5>
          <p>Лучшие цены</p>
        </div>
        <div className="main-item item4" data-aos="fade-right">
          <img src="/assets/img4.png" alt="" />
          <h5>Комплекты</h5>
          <p>Все в одном</p>
        </div>
      </div>
      <div className="products">
        <div className="promotion">
          <h1 data-aos="fade-right">Акции</h1>
          <div className="all-products">
            <Products count={100} />
          </div>
        </div>
        <div className="new">
          <h1 data-aos="fade-right">Новинки</h1>
          <div className="all-products">
            <Products count={4} />
          </div>
        </div>
        <div className="popular">
          <h1 data-aos="fade-right">Популярные товары</h1>
          <div className="all-products">
            <Products count={8} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main