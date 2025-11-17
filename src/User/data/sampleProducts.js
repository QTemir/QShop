// src/data/sampleProducts.js
// Пример данных для страницы товара (использует изображения из src/assets)
// Webpack (CRA/Vite) обработает require/import для картинок в src/.
const sampleProducts = [
    {
        id: "p1",
        title: "Пальто Classic Wool",
        price: "22 799",
        rating: 4.8,
        short: "Тёплое пальто из шерсти премиум-класса",
        description:
            "Классическое пальто из высококачественной шерсти. Мягкая подкладка, удобный крой, аккуратная обработка швов. Идеально для межсезонья и холодной погоды.",
        images: [
            require("../assets/coat1.png"),
            require("../assets/image1.png"),
            require("../assets/image2.png"),
            require("../assets/image3.png"),
        ],
        specs: [
            { key: "Материал", value: "70% шерсть, 30% полиэстер" },
            { key: "Подкладка", value: "100% полиэстер" },
            { key: "Производство", value: "Казахстан" },
            { key: "Уход", value: "Химчистка" },
        ],
        recommendations: ["p2", "p3"],
    },

    // Рекомендации (фиктивные, для примера — используют image1/image2)
    {
        id: "p2",
        title: "Пальто Urban Fit",
        price: "18 500",
        rating: 4.6,
        short: "Современное пальто для города",
        description: "Удобное и стильное пальто для повседневной носки. Лёгкое, тёплое, регулярный крой.",
        images: [require("../assets/image1.png")],
        specs: [{ key: "Материал", value: "Ворсистая смесь" }],
        recommendations: ["p1", "p3"],
    },

    {
        id: "p3",
        title: "Пальто Weekend",
        price: "16 300",
        rating: 4.5,
        short: "Комфортное пальто для выходных",
        description: "Мягкое пальто свободного кроя. Отличный выбор для непринуждённого образа.",
        images: [require("../assets/image2.png")],
        specs: [{ key: "Материал", value: "Смесь шерсти и акрила" }],
        recommendations: ["p1"],
    },
];

export default sampleProducts;
