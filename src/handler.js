const { nanoid } = require('nanoid');
const books = require('./books');

// variable tambahBuku
const tambahBuku = (request, h) => {
  // mengambil nilai object
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
    // nama tidak boleh kosong, jika kosong error 400
  if (!name || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  // readPage tidak boleh lebih besar dari pageCount harus error 400
  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);
  const kutubuku = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  // push/upload buku
  books.push(kutubuku);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // pesan jika upload sukse/berhasil dengan code 201
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // jika upload gagal akan dibalikan code 500
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// variable tampilBuku
const tampilBuku = (request, h) => {
  const { name, reading, finished } = request.query;

  let Buku = books;
  // mengfilter variable menjadi kutubuku agar dibungkus jadi satu
  if (name !== undefined) {
    Buku = Buku.filter((kutubuku) => kutubuku.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    Buku = Buku.filter((kutubuku) => kutubuku.reading === !!Number(reading));
  }

  if (finished !== undefined) {
    Buku = Buku.filter((kutubuku) => kutubuku.finished === !!Number(finished));
  }

  // menampilkan data yang sudah dibungkus di kutu_buku diatass
  const response = h.response({
    status: 'success',
    data: {
      books: Buku.map((kutubuku) => ({
        id: kutubuku.id,
        name: kutubuku.name,
        publisher: kutubuku.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// variable detailBuku
const detailBuku = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  // jika id tidak ditemukan akan dibalikan code 404
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// variable editBuku
const editBuku = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((kutubuku) => kutubuku.id === id);

  if (index !== -1) {
    // gagal memperbarui buku dibalikan dengan code 400
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    // readPage tidak boleh lebih besar dari pageCount harus error 400
    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const finished = (pageCount === readPage);

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    // buku berhasil diperbarui dengan code 200
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // gagal memperbarui buku karena sudah diquery berdasarkan id dan akan dibalikan dengan code 404
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// variable hapusBuku
const hapusBuku = (request, h) => {
  // hapus buku berdasarkan id
  const { id } = request.params;

  const index = books.findIndex((kutubuku) => kutubuku.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  // jika buku gagal dihapus maka akan dibalikan dengan code 404
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  tambahBuku, tampilBuku, detailBuku, editBuku, hapusBuku,
};
