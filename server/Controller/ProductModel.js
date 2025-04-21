// const ProductModel = require("../model/ProductModel");

// class ProductController {
//     async AddProduct(req, res){
//         try{
//             const { name, title, price, weight, sold, like } = req.body;

//             console.log(name, title, price, weight, sold, like);

//             const newProdut = await ProductModel({
//                 name,
//                 title,
//                 price,
//                 weight,
//                 solid,
//                 like
//             })
            
//             await newProdut.save()

//         }catch(e){
//             console.log('Ошибка', e)
//         }
//     }
// }