const {
  tambahBuku, tampilBuku, detailBuku, editBuku, hapusBuku,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: tambahBuku,
  },
  {
    method: 'GET',
    path: '/books',
    handler: tampilBuku,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: detailBuku,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBuku,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: hapusBuku,
  },
];

module.exports = routes;
