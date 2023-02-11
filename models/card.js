// Надо удалить этот файл. Минин удалил, до подключения к БД

// const path = require('path');
// const fs = require('fs');

// // Генерируем заранее путь который будем использовать
// const p = path.join(
//     path.dirname(process.mainModule.filename),
//     'data',
//     'card.json'
// )

// // Корзина - действия с товаром в корзине (добавление, удаление, работа с ценой)
// class Card {
//     static async add(motorHome) {
//         // Получаем все данные корзины
//         const card = await Card.fetch();
//         // Добавляем товар
//         const idx = card.motorHomes.findIndex(m => m.id === motorHome.id);
//         // Проверяем существует ли такой индекс
//         const candidate = card.motorHomes[idx]; 
//         if (candidate) {
//             //Если курс уже есть. Увеличиваем count на единицу
//             candidate.count++;
//             // После этого в массиве motorHomes заменяем данный объект
//             card.motorHomes[idx] = candidate;
//         } else {
//             // Если нужно добавить курс
//             motorHome.count = 1;
//             card.motorHomes.push(motorHome);
//         }
//         // Указываем общую стоимость всех курсов, которые сейчас уже есть
//         card.price += +motorHome.price;
//         // Записываем обратно уже сформированный card в card.json
//         return new Promise((resolve, reject) => {
//             fs.writeFile(p, JSON.stringify(card), (err) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });
//         });

//     };

//     // Удаление
//     static async remove(id) {
//         // Получаем данные из БД
//         const card = await Card.fetch();

//         const idx = card.motorHomes.findIndex(m => m.id === id);
//         const motorHome = card.motorHomes[idx];

//         if (motorHome.count === 1) {
//             // Удалить курс
//             card.motorHomes = card.motorHomes.filter(m => m.id !== id);
//         } else {
//             // Изменить количество
//             card.motorHomes[idx].count--;
//         }
//         //Пересчитываем цену
//         card.price -= motorHome.price;
//         // Вносим все в корзину
//         return new Promise((resolve, reject) => {
//             fs.writeFile(p, JSON.stringify(card), (err) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(card);
//                 }
//             });
//         });
//     };

//     // Получаем данные из корзины - считываем файл и через промис отдаем его наружу
//     static async fetch() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(p, 'utf-8', (err, content) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(JSON.parse(content));
//                 }
//             });
//         });
//     };
// };

// module.exports = Card;