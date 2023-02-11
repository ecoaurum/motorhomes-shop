// Модель автодома

const {Schema, model} = require('mongoose');
// Создание модели автодома
const motorHomeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String,
    description: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Фиксим проблему совместимости id и _id
motorHomeSchema.method('toClient', function() {
    // Получаем объект нашего товара
    const motorHome = this.toObject();
    // Производим трансформацию
    motorHome.id = motorHome._id;
    delete motorHome._id;

    return motorHome;
});

module.exports = model('MotorHome', motorHomeSchema);



// ====Старый код, до БД=======================================================
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');
// const path = require('path');
// const {Schema, model} = require('mongoose');


// const motorHome= new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     img: String
// });

// module.exports = model('MotorHome', motorHome)




// Просто пример первого кода
// class MotorHomes {
//     constructor(title, price, img) {
//         this.title = title,
//         this.price = price,
//         this.img = img,
//         this.id = uuidv4()
//     }

//     // Функция которая будет вносить данные в пустой массив motorhomes.json
//     toJSON() {
//         return {
//             title: this.title,
//             price: this.price,
//             img: this.img,
//             id: this.id
//         }
//     }

//     //Добавление нового автодома
//     async save() {
//         const motorHomes = await MotorHomes.getAll();
//         motorHomes.push(this.toJSON());

//         // Вносим полученные данные из формы в пустой массив motorhomes.json
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'motorhomes.json'),
//                 JSON.stringify(motorHomes),
//                 (err) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve();
//                     }
//                 }
//             )

//         });
//     }

//     // Получаем все данные из motorhomes.json
//     static getAll() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(
//                 path.join(__dirname, '..', 'data', 'motorhomes.json'),
//                 'utf-8',
//                 (err, content) => {
//                     if (err) {
//                         reject(err);
//                     } else  {
//                         resolve(JSON.parse(content));
//                     }
//                 }
//             )
//         })
//     };
// };

// module.exports = MotorHomes;

// =========================================================================
// class MotorHome {
//     constructor(title, price, img) {
//         this.title = title,
//         this.price = price,
//         this.img = img,
//         this.id = uuidv4()
//     }

//     // Функция которая будет вносить данные в пустой массив motorhomes.json
//     toJSON() {
//         return {
//             title: this.title,
//             price: this.price,
//             img: this.img,
//             id: this.id
//         }
//     }

// ==========================================================================
// Старый настоящий код - до подключения БД
//     class MotorHome {
//     constructor(title, price, img) {
//         this.title = title,
//         this.price = price,
//         this.img = img,
//         this.id = uuidv4()
//     }

//     // Функция которая будет вносить данные в пустой массив motorhomes.json
//     toJSON() {
//         return {
//             title: this.title,
//             price: this.price,
//             img: this.img,
//             id: this.id
//         }
//     }

//     // Функция обновления страницы с автодомом после внесенных изменений при редактировании
//     static async update(motorHome) {
//         // Получаем все курсы
//         const motorHomes = await MotorHome.getAll();
//         // Находим индекс товара который хочем обновить
//         const idx = motorHomes.findIndex((m) => m.id === motorHome.id);
//         // Говорим, что у данного индекса нужно заменить объект на объект motorHome
//         motorHomes[idx] = motorHome;
//         // Сохраняем изменения
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'motorhomes.json'),
//                 JSON.stringify(motorHomes),
//                 (err) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve();
//                     }
//                 }
//             );
//         });
//     };

//     //Добавление нового автодома
//     async save() {
//         const motorHomes = await MotorHome.getAll();
//         motorHomes.push(this.toJSON());
//         // Вносим полученные данные из формы в пустой массив motorhomes.json
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'motorhomes.json'),
//                 JSON.stringify(motorHomes),
//                 (err) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve();
//                     }
//                 }
//             );
//         });
//     };

//     // Получаем все данные из motorhomes.json
//     static getAll() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(
//                 path.join(__dirname, '..', 'data', 'motorhomes.json'),
//                 'utf-8',
//                 (err, content) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(JSON.parse(content));
//                     }
//                 }
//             );
//         });
//     };

//     // Находим курс по id
//     static async getById(id) {
//         //Получаем все курсы
//         const motorHomes = await MotorHome.getAll();
//         // Возвращаем тот курс, который должны получить по id
//         return motorHomes.find(m => m.id === id);
//         // return motorHomes.find((c) => {c.id === id});
//     };
// };

// module.exports = MotorHome;