//Достаем данные в нашем случае с файла data.json
document.addEventListener("DOMContentLoaded", () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const treeData = transformData(data.services)
            const treeContainer = document.querySelector('.tree')
            const ul = createTree(treeData)
            treeContainer.appendChild(ul)
        })
        .catch(error => console.error('Error fetching data:', error))
//Эта функция строит DOM-структуру дерева на основе данных
    function createTree(treeData) {
        const ul = document.createElement('ul')
        treeData.forEach(node => {
            const li = document.createElement('li')
            const span = document.createElement('span')
            span.textContent = node.name
            li.appendChild(span)
            if (node.children && node.children.length > 0) {
                li.classList.add('parent_li')
                const childrenUl = createTree(node.children);
                li.appendChild(childrenUl)
                span.addEventListener('click', () => {
                    li.classList.toggle('open')
                });
            } else {
                const priceSpan = document.createElement('span')
                priceSpan.textContent = `${node.price === 0 ? '' : node.price + ' ₽'}`
                priceSpan.classList.add('price')
                li.appendChild(priceSpan)
            }
            ul.appendChild(li)
        });
        return ul
    }

    function transformData(services) {
        const map = {}
        const treeData = []
        services.forEach(service => {
            map[service.id] = { ...service, children: [] }
        })
        services.forEach(service => {
            const node = map[service.id]
            if (service.head === null) {
                treeData.push(node)
            } else {
                const parent = map[service.head]
                if (parent) {
                    parent.children.push(node)
                }
            }
        });
        return treeData
    }
});
