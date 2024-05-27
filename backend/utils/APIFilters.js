class APIFilters {
  constructor(query, queryStr) {
    this.query = query; // MongoDB sorgusu
    this.queryStr = queryStr; // HTTP isteğinden gelen sorgu dizisi
  }

  // Arama sorgusunu gerçekleştirir
  searchResult() {
    // Eğer arama sorgusu varsa, 'name' alanında arama yapar
    const search = this.queryStr.search
      ? {
          name: {
            $regex: this.queryStr.search, // Aranan kelimeye benzer olanları bulur
            $options: "i", // Büyük/küçük harf duyarsız arama yapar
          },
        }
      : {};
    this.query = this.query.find({ ...search });
    return this;
  }

  // Filtreleri uygular (Örneğin, fiyat, derecelendirme vb.)
  filters() {
    const queryCopy = { ...this.queryStr };

    // Kaldırılacak alanlar
    const fieldsToRemove = ["search", "page"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    // Fiyat, derecelendirme gibi filtreler için gelişmiş filtre
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // Sayfalama işlemini gerçekleştirir
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1; // Geçerli sayfa numarası veya varsayılan olarak 1
    const skip = resPerPage * (currentPage - 1); // Atlanacak kayıt sayısı

    this.query = this.query.limit(resPerPage).skip(skip);
  }
}
export default APIFilters;
