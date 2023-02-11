// Преобразовываем в валюту USD
const toCurrency = (price) => {
    return new Intl.NumberFormat('us-US', {
        currency: 'usd',
        style: 'currency'
    }).format(price)
};
document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
});

// Форматирование даты
const toDate = date => {
    return new Intl.DateTimeFormat('ua-UA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
};
document.querySelectorAll('.date').forEach((node) => {
    node.textContent = toDate(node.textContent)
});

// Удаление товара. Вначале выясняем, есть ли div с #card. 
// Значок $ означает, что переменная содержит html элемент
const $card = document.querySelector('#card');
if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;
            // Вызываем запрос с клиента и отправляем его на сервер
            fetch('/card/remove/' + id, {
                method: 'delete'
            }).then(res => res.json())
              .then(card => {
                if (card.motorHomes.length) {
                    const html = card.motorHomes.map(m => {
                        return `
                        <tr>
                            <td>${m.title}</td>
                            <td>${m.count}</td>
                            <td>
                                <button class="btn btn-small js-remove" data-id="${m.id}">Удалить</button>
                            </td>
                        </tr>
                        `
                    }).join('');
                    $card.querySelector('tbody').innerHTML = html;
                    // Пересчитывам цену
                    $card.querySelector('.price').textContent = toCurrency(card.price);
                } else {
                    $card.innerHTML = '<p>Корзина пуста</p>'
                }
              })
        };
    });
};

// Инициализация табов на странице с регитсрацией. Функция взята из materialize css
M.Tabs.init(document.querySelectorAll('.tabs'));